/**
 * Sprintly API - Get Person
 *
 * Returns the given user_id.
 *
 * EXAMPLE:
 *
 * var person = sprintly_api.people.get( 123 );
 *
 * Fetched person also saved to: sprintly_api.people.data.person
 *
 * @param person_id number
 * @return sprintly_api.people.data.person
 */
sprintly_api.people.get = function(person_id)
{
	// Make sure we have a person id defined
	if(typeof person_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Person ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/people/'+ person_id +'.json',
			function(data)
			{
				sprintly_api.people.data.person = data;
				sprintly_api.track('API', 'People', 'Get Success');
			},
			function(error)
			{
				sprintly_api.people.data.person = null;
				sprintly_api.track('API', 'People', 'Get Error: ' + error);
				sprintly_api.debug('error', 'Get Person Error: ' + error);
			}
		);

		sprintly_api.track('API', 'People', 'Get: ' + person_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.people.data.person;
};