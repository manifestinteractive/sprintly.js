/**
 * Sprintly API - Add People
 *
 * Allows you to add invite someone to your product. All this does is kick off an invite to
 * the email specified in the request. NOTE: The user making this API request must be an
 * admin of the product or the account holder who created the product. Additionally,
 * this will not delete the user's record from the system.
 *
 * EXAMPLES:
 *
 * var invite_user = sprintly_api.people.invite('John', 'Doe', 'john.doe@sprint.ly');
 * var invite_admin = sprintly_api.people.invite('Jane', 'Doe', 'jane.doe@sprint.ly', true);
 *
 * New person response also saved to: sprintly_api.people.data.invite
 *
 * @param arguments object
 * @return sprintly_api.people.data.invite
 */
sprintly_api.people.invite = function(first_name, last_name, email, is_admin)
{
	var valid_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	// Make sure we have a type defined
	if(typeof is_admin === 'undefined')
	{
		is_admin = false;
	}
	else if(typeof is_admin !== 'boolean')
	{
		sprintly_api.debug('error', 'Invalid First Name');
		return null;
	}

	// Make sure we have a type defined
	if(typeof first_name !== 'string')
	{
		sprintly_api.debug('error', 'Invalid First Name');
		return null;
	}

	// Make sure we have a type defined
	if(typeof last_name !== 'string')
	{
		sprintly_api.debug('error', 'Invalid Last Name');
		return null;
	}

	// Make sure API Email is valid
	if(typeof email !== 'string' || !valid_email.test(email))
	{
		sprintly_api.debug('error', 'Invalid Email Address');
		return null;
	}

	var post_data = {
		admin: is_admin,
		first_name: first_name,
		last_name: last_name,
		email: email
	};

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/people.json',
			function(data)
			{
				sprintly_api.people.data.invite = data;
				sprintly_api.track('API', 'People', 'Invite Success');
			},
			function(error)
			{
				sprintly_api.people.data.invite = null;
				sprintly_api.track('API', 'People', 'Invite People: ' + error);
				sprintly_api.debug('error', 'Invite People Error: ' + error);
			},
			post_data,
			'POST'
		);

		sprintly_api.track('API', 'People', 'Invite: ' + JSON.stringify(post_data));
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.people.data.invite;
};