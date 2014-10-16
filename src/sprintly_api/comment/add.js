/**
 * Sprintly API - Add Comment
 *
 * Create a new comment on the given item_id on behalf of the requesting user.
 *
 * EXAMPLE:
 *
 * var new_comment = sprintly_api.comment.add(123, 'This is one sassy comment.');
 *
 * New comment response also saved to: sprintly_api.comment.data.new_comment
 *
 * @param arguments object
 * @return sprintly_api.comment.data.new_comment
 */
sprintly_api.comment.add = function(item_id, comment)
{
	// Make sure we have a type defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make sure we have a type defined
	if(typeof comment !== 'string')
	{
		sprintly_api.debug('error', 'Invalid Comment');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/comments.json',
			function(data)
			{
				sprintly_api.comment.data.new_comment = data;
				sprintly_api.track('API', 'Comment', 'Add Success');
			},
			function(error)
			{
				sprintly_api.comment.data.new_comment = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Comment', 'Add Comment: ' + error);
				sprintly_api.debug('error', 'Add Comment Error: ' + error);
			},
			{ body: comment },
			'POST'
		);

		sprintly_api.track('API', 'Comment', 'Add: item_id: ' + item_id + ', comment' + comment);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.comment.data.new_comment;
};