/**
 * Sprintly API - Archive Item
 *
 * Archive the specified item.
 * NOTE: This does not delete the item.
 * Destructive operations are not allowed via the API on items.
 *
 * EXAMPLE:
 *
 * var archive_item = sprintly_api.item.archive( 123 );
 *
 * Archive item response saved to: sprintly_api.item.data.archive_item
 *
 * @param item_id number
 * @return sprintly_api.item.data.archive_item
 */
sprintly_api.item.archive = function(item_id)
{
	// Make sure we have a type defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'.json',
			function(data)
			{
				sprintly_api.item.data.archive_item = data;
				sprintly_api.track('API', 'Item', 'Archive Success');
			},
			function(error)
			{
				sprintly_api.item.data.archive_item = null;
				sprintly_api.track('API', 'Item', 'Archive Error: ' + error);
				sprintly_api.debug('error', 'Archive Item Error: ' + error);
			},
			null,
			'DELETE'
		);

		sprintly_api.track('API', 'Item', 'Archive: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.archive_item;
};