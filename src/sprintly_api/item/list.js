/**
 * Sprintly API - Item List
 *
 * Query a product's items by various arguments. If no arguments are provided,
 * it will only return items that are in the backlog and in-progress.
 *
 * EXAMPLE:
 *
 * var item_list = sprintly_api.item.list();
 *
 * Item list saved to: sprintly_api.item.data.list
 *
 * @return sprintly_api.item.data.list
 */
sprintly_api.item.list = function()
{
	sprintly_api.track('API', 'Item', 'Get List');

	var date = new Date();
	var now = date.getTime();

	// Check for Fresh Cache
	if(typeof sprintly_api.item.last_update.list !== 'undefined' && typeof sprintly_api.item.data.list !== 'undefined')
	{
		if(now - sprintly_api.item.last_update.list <= sprintly_api.settings.time_until_stale)
		{
			sprintly_api.debug('log', 'Ignoring API call since data is not old');

			return sprintly_api.item.data.list;
		}
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items.json',
			function(data)
			{
				var date = new Date();

				sprintly_api.item.last_update.list = date.getTime();
				sprintly_api.item.data.list = data;
				sprintly_api.track('API', 'Item', 'Success');
			},
			function(error)
			{
				sprintly_api.item.data.list = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Item', 'Error: ' + error);
				sprintly_api.debug('error', 'Item List Error: ' + error);
			}
		);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.list;
};