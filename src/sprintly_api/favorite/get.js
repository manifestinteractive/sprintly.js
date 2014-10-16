/**
 * Sprintly API - Get Favorite
 *
 * Return the user object for who created the given favorite
 *
 * EXAMPLE:
 *
 * var favorite = sprintly_api.favorite.get(3, 123);
 *
 * Fetched favorite also saved to: sprintly_api.favorite.data.user_data
 *
 * @param item_id number
 * @param favorite_id number
 * @return sprintly_api.favorite.data.user_data
 */
sprintly_api.favorite.get = function(item_id, favorite_id)
{
	// Make sure we have a person id defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make sure we have a favorite id defined
	if(typeof favorite_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Favorite ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/favorites/'+ favorite_id +'.json',
			function(data)
			{
				sprintly_api.favorite.data.user_data = data;
				sprintly_api.track('API', 'Favorite', 'Get Success');
			},
			function(error)
			{
				sprintly_api.favorite.data.user_data = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Favorite', 'Get Error: ' + error);
				sprintly_api.debug('error', 'Get Person Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Favorite', 'Get: item_id: ' + item_id + ', favorite_id: ' + favorite_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.favorite.data.user_data;
};