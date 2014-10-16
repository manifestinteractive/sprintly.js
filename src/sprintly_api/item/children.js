/**
 * Sprintly API - Item Children
 *
 * Returns any child items. NOTE: This only works on items that are of type story
 * as they are the only type of item which are allowed to have child items.
 *
 * EXAMPLE:
 *
 * var item_children = sprintly_api.item.children( 123 );
 *
 * Fetched children also saved to: sprintly_api.item.data.item_children
 *
 * @param item_id number
 * @return sprintly_api.item.data.item_children
 */
sprintly_api.item.children = function(item_id)
{
	// Make sure we have a type defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Fetch original item to validate requirements
	var item = sprintly_api.item.get(item_id);

	// Make sure we are only dealing with stories
	if(item.type !== 'story')
	{
		sprintly_api.debug('error', 'Only items with a type of "story" can have child items.');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/children.json',
			function(data)
			{
				sprintly_api.item.data.item_children = data;
				sprintly_api.track('API', 'Item', 'Children Success');
			},
			function(error)
			{
				sprintly_api.item.data.item_children = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Item', 'Children Error: ' + error);
				sprintly_api.debug('error', 'Item Children Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Item', 'Children: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.item_children;
};