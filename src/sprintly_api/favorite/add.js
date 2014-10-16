/**
 * Sprintly API - Add Favorite
 *
 * Create a new favorite on the given item_id on behalf of the requesting user.
 *
 * EXAMPLE:
 *
 * var new_favorite = sprintly_api.favorite.add( 123 );
 *
 * New favorite response also saved to: sprintly_api.favorite.data.new_favorite
 *
 * @param item_id number
 * @return sprintly_api.favorite.data.new_favorite
 */
sprintly_api.favorite.add = function(item_id)
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
				sprintly_api.favorite.data.new_favorite = data;
				sprintly_api.track('API', 'Favorite', 'Add Success');
			},
			function(error)
			{
				sprintly_api.favorite.data.new_favorite = null;
				sprintly_api.track('API', 'Favorite', 'Add Favorite: ' + error);
				sprintly_api.debug('error', 'Add Favorite Error: ' + error);
			},
			null,
			'POST'
		);

		sprintly_api.track('API', 'Favorite', 'Add: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.favorite.data.new_favorite;
};