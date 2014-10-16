/**
 * Sprintly API - Get People
 *
 * Returns a list of user records that are members of your product.
 *
 * EXAMPLE:
 *
 * var people = sprintly_api.people.list();
 *
 * People list also saved to: sprintly_api.people.data.people_list
 *
 * @return sprintly_api.people.data.people_list
 */
sprintly_api.people.list = function()
{
	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/people.json',
			function(data)
			{
				sprintly_api.people.data.people_list = data;
				sprintly_api.track('API', 'People', 'List Success');
			},
			function(error)
			{
				sprintly_api.people.data.people_list = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'People', 'List Error: ' + error);
				sprintly_api.debug('error', 'List People Error: ' + error);
			}
		);

		sprintly_api.track('API', 'People', 'List');
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.people.data.people_list;
};