/**
 * Sprintly API - Get Comment
 *
 * Returns the given comment_id.
 *
 * EXAMPLE:
 *
 * var first_comment = sprintly_api.comment.get( 123, 123456 );
 *
 * Fetched comment also saved to: sprintly_api.comment.data.item_comment
 *
 * @param item_id number
 * @param comment_id number
 * @return sprintly_api.comment.data.item_comment
 */
sprintly_api.comment.get = function(item_id, comment_id)
{
	// Make sure we have a item id defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make sure we have a comment id defined
	if(typeof comment_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Comment ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/comments/'+ comment_id +'.json',
			function(data)
			{
				sprintly_api.comment.data.item_comment = data;
				sprintly_api.track('API', 'Comment', 'Get Success');
			},
			function(error)
			{
				sprintly_api.comment.data.item_comment = null;
				sprintly_api.track('API', 'Comment', 'Get Error: ' + error);
				sprintly_api.debug('error', 'Get Comment Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Comment', 'Get: ' + item_id + ', comment: ' + comment_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.comment.data.item_comment;
};