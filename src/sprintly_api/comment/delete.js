/**
 * Sprintly API - Delete Comment
 *
 * Delete the comment specified by comment_id. NOTE: You cannot delete code commits via the API.
 *
 * EXAMPLE:
 *
 * var delete_comment = sprintly_api.comment.delete( 123, 123456 );
 *
 * Deleted comment response saved to: sprintly_api.comment.data.deleted_comment
 *
 * @param item_id number
 * @param comment_id number
 * @return sprintly_api.comment.data.deleted_comment
 */
sprintly_api.comment.delete = function(item_id, comment_id)
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
				sprintly_api.comment.data.deleted_comment = data;
				sprintly_api.track('API', 'Comment', 'Delete Success');
			},
			function(error)
			{
				sprintly_api.comment.data.deleted_comment = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Comment', 'Delete Error: ' + error);
				sprintly_api.debug('error', 'Delete Comment Error: ' + error);
			},
			null,
			'DELETE'
		);

		sprintly_api.track('API', 'Comment', 'Delete: item: ' + item_id + ', comment: ' + comment_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.comment.data.deleted_comment;
};