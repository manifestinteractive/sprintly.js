/**
 * Sprintly API - Search Items
 *
 * Query a product's items by various arguments. If no arguments are provided,
 * it will only return items that are in the backlog and in-progress.
 *
 * Possible search filter keys:
 *
 * type, status, offset, limit, order_by, assigned_to, created_by & tags
 *
 * EXAMPLE:
 *
 * var search_results = sprintly_api.item.search({
 *      status: 'accepted',
 *      type: 'task'
 * });
 *
 * @param filters object
 */
sprintly_api.item.search = function(filters)
{
	// Setup Search Filters ( only add valid formatted filters )
	var search_filters = {};

	// Check if we want to filter by type
	if(filters.type && sprintly_api.item.valid.type.indexOf(filters.type) !== -1)
	{
		search_filters.type = filters.type;
	}

	// Check if we want to filter by status
	if(filters.status && sprintly_api.item.valid.status.indexOf(filters.status) !== -1)
	{
		search_filters.status = filters.status;
	}

	// Check if we want to filter by offset
	if(filters.offset && typeof filters.offset === 'number')
	{
		search_filters.offset = filters.offset;
	}

	// Check if we want to filter by limit
	if(filters.limit && typeof filters.limit === 'number')
	{
		search_filters.limit = filters.limit;
	}

	// Check if we want to filter by order_by
	if(filters.order_by && sprintly_api.item.valid.order_by.indexOf(filters.order_by) !== -1)
	{
		search_filters.order_by = filters.order_by;
	}

	// Check if we want to filter by assigned_to
	if(filters.assigned_to && typeof filters.assigned_to === 'number')
	{
		search_filters.assigned_to = filters.assigned_to;
	}

	// Check if we want to filter by created_by
	if(filters.created_by && typeof filters.created_by === 'number')
	{
		search_filters.created_by = filters.created_by;
	}

	// Check if we want to filter by created_by
	if(filters.tags && typeof filters.tags === 'string')
	{
		search_filters.tags = filters.tags;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items.json',
			function(data)
			{
				sprintly_api.item.data.search_results = data;
				sprintly_api.track('API', 'Item', 'Success');
			},
			function(error)
			{
				sprintly_api.item.data.search_results = null;
				sprintly_api.track('API', 'Item', 'Search Error: ' + error);
				sprintly_api.debug('error', 'Item Search Error: ' + error);
			},
			search_filters
		);

		sprintly_api.track('API', 'Item', 'Search: ' + JSON.stringify(search_filters));
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.search_results;
};