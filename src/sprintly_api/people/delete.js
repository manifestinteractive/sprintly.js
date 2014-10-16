/**
 * Sprintly API - Delete Person
 *
 * Remove the given user from the given product.
 * NOTE: The user making this API request must be an admin of the product
 * or the account holder who created the product. Additionally, this will not
 * delete the user's record from the system.
 *
 * EXAMPLE:
 *
 * var delete_person = sprintly_api.people.delete( 123 );
 *
 * Deleted people response saved to: sprintly_api.people.data.deleted_person
 *
 * @param person_id number
 * @return sprintly_api.people.data.deleted_person
 */
sprintly_api.people.delete = function(person_id)
{
	// Make sure we have a people id defined
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
				sprintly_api.people.data.deleted_person = data;
				sprintly_api.track('API', 'People', 'Delete Success');
			},
			function(error)
			{
				sprintly_api.people.data.deleted_person = null;
				sprintly_api.track('API', 'People', 'Delete Error: ' + error);
				sprintly_api.debug('error', 'Delete People Error: ' + error);
			},
			null,
			'DELETE'
		);

		sprintly_api.track('API', 'People', 'Delete: ' + person_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.people.data.deleted_person;
};