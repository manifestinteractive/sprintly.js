/**
 * Sprintly API - Product List
 *
 * Get Product List
 *
 * EXAMPLE:
 *
 * var products = sprintly_api.product.list();
 *
 * List also saved to: sprintly_api.product.data
 *
 * If only one item is active, sprintly_api.product.selected is automatically set
 *
 * NOTE: If you have more than one product, you will need to set: sprintly_api.product.selected
 * before making any other API calls.
 *
 * @param object
 * @return sprintly_api.product.data
 */
sprintly_api.product = {
	data: null,
	selected: null,
	last_update: null,
	list: function()
	{
		sprintly_api.track('API', 'Product', 'List');

		var date = new Date();
		var now = date.getTime();

		if(sprintly_api.product.last_update && sprintly_api.product.data)
		{
			if(now - sprintly_api.product.last_update <= sprintly_api.settings.time_until_stale)
			{
				sprintly_api.debug('log', 'Ignoring API call since data is not old');

				return sprintly_api.product.data;
			}
		}

		sprintly_api.call(
			'products.json',
			function(data)
			{
				var date = new Date();

				sprintly_api.product.last_update = date.getTime();

				// Store Product List
				sprintly_api.product.data = data;

				// Check if only one is active, and set it as selected
				var active_count = 0;
				var first_active = null;

				for(var i=0; i<sprintly_api.product.data.length; i++)
				{
					if(sprintly_api.product.data[i].archived === false)
					{
						active_count++;
						if( !first_active)
						{
							first_active = sprintly_api.product.data[i].id;
						}
					}
				}

				if(active_count === 1)
				{
					sprintly_api.product.selected = first_active;
				}

				sprintly_api.track('API', 'Product', 'List Success');
			},
			function(error)
			{
				sprintly_api.product.data = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Product', 'List Error: ' + error);
				sprintly_api.debug('error', 'Product List Error: ' + error);
			}
		);

		return sprintly_api.product.data;
	}
};