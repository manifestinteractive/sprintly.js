/**
 * Sprintly API - Get Comment List for Item
 *
 * Fetch comments for the given item_id. A list of
 * comments ordered chronologoically are returned.
 *
 * EXAMPLE:
 *
 * var item_comments = sprintly_api.comment.list( 123 );
 *
 * Fetched comments also saved to: sprintly_api.comment.data.item_comments
 *
 * @param item_id number
 * @return sprintly_api.comment.data.item_comments
 */
sprintly_api.comment.list = function(item_id)
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
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/comments.json',
			function(data)
			{
				sprintly_api.comment.data.item_comments = data;
				sprintly_api.track('API', 'Comment', 'List Success');
			},
			function(error)
			{
				sprintly_api.comment.data.item_comments = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Comment', 'List Error: ' + error);
				sprintly_api.debug('error', 'List Comment Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Comment', 'List: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.comment.data.item_comments;
};