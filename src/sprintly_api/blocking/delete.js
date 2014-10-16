/**
 * Sprintly API - Delete Blocking
 *
 * Delete the given blocking_id
 *
 * EXAMPLE:
 *
 * var deleted_blocking = sprintly_api.blocking.delete(3, 123);
 *
 * Deleted blocking also saved to: sprintly_api.blocking.data.user_data
 *
 * @param item_id number
 * @param blocking_id number
 * @return sprintly_api.blocking.data.deleted_blocking
 */
sprintly_api.blocking.delete = function(item_id, blocking_id)
{
	// Make sure we have a item id defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make sure we have a blocking id defined
	if(typeof blocking_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Blocking ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/blocking/'+ blocking_id +'.json',
			function(data)
			{
				sprintly_api.blocking.data.deleted_blocking = data;
				sprintly_api.track('API', 'Blocking', 'Delete Success');
			},
			function(error)
			{
				sprintly_api.blocking.data.deleted_blocking = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Blocking', 'Delete Error: ' + error);
				sprintly_api.debug('error', 'Delete Blocking Error: ' + error);
			},
			null,
			'DELETE'
		);

		sprintly_api.track('API', 'Blocking', 'Delete: item_id: ' + item_id + ', blocking_id: ' + blocking_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.blocking.data.deleted_blocking;
};