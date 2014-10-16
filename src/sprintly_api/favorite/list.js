/**
 * Sprintly API - Get Favorite
 *
 * The favorites API lets you access who has favorited a given item.
 * Additionally, you can create and remove favorites via the API.
 *
 * EXAMPLE:
 *
 * var favorite = sprintly_api.favorite.list( 123 );
 *
 * Favorite list also saved to: sprintly_api.favorite.data.favorite_list
 *
 * @param item_id number
 * @return sprintly_api.favorite.data.favorite_list
 */
sprintly_api.favorite.list = function(item_id)
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
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/favorites.json',
			function(data)
			{
				sprintly_api.favorite.data.favorite_list = data;
				sprintly_api.track('API', 'Favorite', 'List Success');
			},
			function(error)
			{
				sprintly_api.favorite.data.favorite_list = null;
				sprintly_api.track('API', 'Favorite', 'List Error: ' + error);
				sprintly_api.debug('error', 'List Favorite Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Favorite', 'List');
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.favorite.data.favorite_list;
};