/*! SprintlyJS - Sprint.ly API Javascript Library
 * @link https://github.com/manifestinteractive/sprintly.js
 * @author Manifest Interactive, LLC, <hello@manifestinteractive.com>
 * @version 0.2.0
 * @license The MIT License.
 * @copyright Copyright (C) 2014 Manifest Interactive, LLC,
 * @builddate 2014-10-16
 */
var sprintly_api = {
	auth: {
		email: null,
		api_key: null
	},
	settings:
	{
		base_url: 'https://sprint.ly/api/',
		time_until_stale: 10000
	},
	initialized: false,
	ajax: null,
	ajax_in_process: false,
	init: function(email, api_key)
	{
		var valid_email = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var valid_apikey = /^([a-zA-Z0-9]{32})$/;

		// Set API Email if Present
		if(typeof email !== 'undefined')
		{
			sprintly_api.auth.email = email;
		}

		// Set API Key if Present
		if(typeof api_key !== 'undefined')
		{
			sprintly_api.auth.api_key = api_key;
		}

		// Make sure API Email is valid
		if( !sprintly_api.auth.email || !valid_email.test(sprintly_api.auth.email))
		{
			sprintly_api.debug('error', 'Invalid Email address used for API Authentication');

			return false;
		}

		// Make sure API Key is valid
		if( !sprintly_api.auth.api_key || !valid_apikey.test(sprintly_api.auth.api_key))
		{
			sprintly_api.debug('error', 'Invalid API Key used for API Authentication');

			return false;
		}

		// We're done initializing
		sprintly_api.initialized = true;

		return true;
	},
	call: function(query, success, error, data, method)
	{
		// Make sure API is initialized
		if( !sprintly_api.initialized)
		{
			sprintly_api.init();
		}

		// Set default method
		if( !method)
		{
			method = 'GET';
		}

		// Set approved API request data
		var approved_methods = ['GET','POST','PUT','DELETE'];

		// Check for valid API Method Call
		if(approved_methods.indexOf(method) == -1)
		{
			sprintly_api.debug('error', 'Invalid API Method');

			return false;
		}

		// Prepare AJAX Call Authentication
		$.ajaxSetup({
			beforeSend: function(xhr, settings)
			{
				xhr.setRequestHeader('Authorization', 'Basic ' + btoa(sprintly_api.auth.email + ':' + sprintly_api.auth.api_key));
				sprintly_api.ajax_in_process = true;

				return true;
			}
		});

		// kill any previous AJAX calls
		if(sprintly_api.ajax && sprintly_api.ajax_in_process)
		{
			sprintly_api.ajax.abort();
			sprintly_api.ajax_in_process = false;

			sprintly_api.track('API', 'AJAX', 'Abort');
			sprintly_api.debug('warn', 'Killed Previous AJAX Request');
		}

		// Make AJAX call
		sprintly_api.ajax = $.ajax({
			url: sprintly_api.settings.base_url + query,
			crossDomain: true,
			async: false,
			type: method,
			data: data,
			dataType: 'json'
		});

		sprintly_api.ajax.done(function(data, textStatus, jqXHR){

			sprintly_api.track('API', 'AJAX', 'Success');

			sprintly_api.ajax_in_process = false;

			if(typeof success === 'function')
			{
				return success(data);
			}
			else
			{
				return data;
			}
		});

		sprintly_api.ajax.fail(function(jqXHR, textStatus, errorThrown){

			sprintly_api.track('API', 'AJAX', 'Error: ' + errorThrown);
			sprintly_api.debug('error', 'AJAX Error: ' + errorThrown);

			sprintly_api.track('API', 'AJAX', 'Error Response: ' + JSON.stringify(sprintly_api.ajax.responseJSON));
			sprintly_api.debug('error', sprintly_api.ajax.responseJSON);

			sprintly_api.ajax_in_process = false;

			// This is an AJAX Abort, and that's OK
			if(textStatus === 'abort')
			{
				return false;
			}

			if(typeof error === 'function')
			{
				return error(errorThrown);
			}
			else
			{
				return errorThrown
			}
		});

		return sprintly_api.ajax.responseJSON;
	},
	debug: function(level, message)
	{
		// @TODO: Put your custom debugger here
	},
	track: function(category, action, label, value)
	{
		// @TODO: Put your custom analytics here
	}
};
sprintly_api.blocking = {
	data: {}
};
sprintly_api.comment = {
	data: {}
};
sprintly_api.favorite = {
	data: {}
};
sprintly_api.item = {
	data: {},
	selected: null,
	last_update: {},
	valid: {
		type: ['story', 'task', 'defect', 'test'],
		status: ['someday', 'backlog', 'in-progress', 'completed', 'accepted'],
		order_by: ['priority', 'favorites'],
		score: ['~', 'S', 'M', 'L', 'XL']
	}
};
sprintly_api.people = {
	data: {}
};
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
sprintly_api.blocking.add = function(item_id)
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
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/blocking.json',
			function(data)
			{
				sprintly_api.blocking.data.new_blocking = data;
				sprintly_api.track('API', 'Blocking', 'Add Success');
			},
			function(error)
			{
				sprintly_api.blocking.data.new_blocking = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Blocking', 'Add Blocking: ' + error);
				sprintly_api.debug('error', 'Add Blocking Error: ' + error);
			},
			{ blocked: item_id },
			'POST'
		);

		sprintly_api.track('API', 'Blocking', 'Add: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.blocking.data.new_blocking;
};
sprintly_api.blocking.delete = function(item_id, blocking_id)
{
	// Make sure we have a item id defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make sure we have a blocking id defined
	if(typeof blocking_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Blocking ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/blocking/'+ blocking_id +'.json',
			function(data)
			{
				sprintly_api.blocking.data.deleted_blocking = data;
				sprintly_api.track('API', 'Blocking', 'Delete Success');
			},
			function(error)
			{
				sprintly_api.blocking.data.deleted_blocking = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Blocking', 'Delete Error: ' + error);
				sprintly_api.debug('error', 'Delete Blocking Error: ' + error);
			},
			null,
			'DELETE'
		);

		sprintly_api.track('API', 'Blocking', 'Delete: item_id: ' + item_id + ', blocking_id: ' + blocking_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.blocking.data.deleted_blocking;
};
sprintly_api.blocking.get = function(item_id, blocking_id)
{
	// Make sure we have a item id defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make sure we have a blocking id defined
	if(typeof blocking_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Blocking ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/blocking/'+ blocking_id +'.json',
			function(data)
			{
				sprintly_api.blocking.data.item_blocking = data;
				sprintly_api.track('API', 'Blocking', 'Get Success');
			},
			function(error)
			{
				sprintly_api.blocking.data.item_blocking = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Blocking', 'Get Error: ' + error);
				sprintly_api.debug('error', 'Get Person Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Blocking', 'Get: item_id: ' + item_id + ', blocking_id: ' + blocking_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.blocking.data.item_blocking;
};
sprintly_api.blocking.list = function(item_id)
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
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/blocking.json',
			function(data)
			{
				sprintly_api.blocking.data.blocking_list = data;
				sprintly_api.track('API', 'Blocking', 'List Success');
			},
			function(error)
			{
				sprintly_api.blocking.data.blocking_list = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Blocking', 'List Error: ' + error);
				sprintly_api.debug('error', 'List Blocking Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Blocking', 'List');
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.blocking.data.blocking_list;
};
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
sprintly_api.comment.delete = function(item_id, comment_id)
{
	// Make sure we have a item id defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make sure we have a comment id defined
	if(typeof comment_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Comment ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/comments/'+ comment_id +'.json',
			function(data)
			{
				sprintly_api.comment.data.deleted_comment = data;
				sprintly_api.track('API', 'Comment', 'Delete Success');
			},
			function(error)
			{
				sprintly_api.comment.data.deleted_comment = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Comment', 'Delete Error: ' + error);
				sprintly_api.debug('error', 'Delete Comment Error: ' + error);
			},
			null,
			'DELETE'
		);

		sprintly_api.track('API', 'Comment', 'Delete: item: ' + item_id + ', comment: ' + comment_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.comment.data.deleted_comment;
};
sprintly_api.comment.get = function(item_id, comment_id)
{
	// Make sure we have a item id defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Make sure we have a comment id defined
	if(typeof comment_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Comment ID');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/comments/'+ comment_id +'.json',
			function(data)
			{
				sprintly_api.comment.data.item_comment = data;
				sprintly_api.track('API', 'Comment', 'Get Success');
			},
			function(error)
			{
				sprintly_api.comment.data.item_comment = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Comment', 'Get Error: ' + error);
				sprintly_api.debug('error', 'Get Comment Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Comment', 'Get: ' + item_id + ', comment: ' + comment_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.comment.data.item_comment;
};
sprintly_api.comment.list = function(item_id)
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
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/comments.json',
			function(data)
			{
				sprintly_api.comment.data.item_comments = data;
				sprintly_api.track('API', 'Comment', 'List Success');
			},
			function(error)
			{
				sprintly_api.comment.data.item_comments = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Comment', 'List Error: ' + error);
				sprintly_api.debug('error', 'List Comment Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Comment', 'List: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.comment.data.item_comments;
};
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
				sprintly_api.favorite.data.new_favorite = sprintly_api.ajax.responseJSON;
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
sprintly_api.favorite.delete = function(item_id, favorite_id)
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
				sprintly_api.favorite.data.deleted_favorite = data;
				sprintly_api.track('API', 'Favorite', 'Delete Success');
			},
			function(error)
			{
				sprintly_api.favorite.data.deleted_favorite = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Favorite', 'Delete Error: ' + error);
				sprintly_api.debug('error', 'Delete Favorite Error: ' + error);
			},
			null,
			'DELETE'
		);

		sprintly_api.track('API', 'Favorite', 'Delete: item_id: ' + item_id + ', favorite_id: ' + favorite_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.favorite.data.deleted_favorite;
};
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
				sprintly_api.favorite.data.favorite_list = sprintly_api.ajax.responseJSON;
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
sprintly_api.item.add = function(args)
{
	// Make sure we have a type defined
	if(typeof args.type === 'undefined' || sprintly_api.item.valid.type.indexOf(args.type) === -1)
	{
		sprintly_api.debug('error', 'Invalid Type');
		return null;
	}

	// Make sure we have a title if its not a story
	if(args.type !== 'story' && typeof args.title === 'undefined')
	{
		sprintly_api.debug('error', 'Title Not Provided');
		return null;
	}

	// Make sure we have a who if it is a story
	if(args.type === 'story' && typeof args.who === 'undefined')
	{
		sprintly_api.debug('error', 'Who Not Provided for Story');
		return null;
	}

	// Make sure we have a what if it is a story
	if(args.type === 'story' && typeof args.what === 'undefined')
	{
		sprintly_api.debug('error', 'What Not Provided for Story');
		return null;
	}

	// Make sure we have a why if it is a story
	if(args.type === 'story' && typeof args.why === 'undefined')
	{
		sprintly_api.debug('error', 'Why Not Provided for Story');
		return null;
	}

	// Make sure description is correct
	if(args.description && typeof args.description !== 'string')
	{
		sprintly_api.debug('error', 'Invalid Description');
		return null;
	}

	// Make sure we have a valid description
	if(args.score && sprintly_api.item.valid.score.indexOf(args.score) === -1)
	{
		sprintly_api.debug('error', 'Invalid Score');
		return null;
	}
	else if(typeof args.score === 'undefined')
	{
		args.score = '~';
	}

	// Make sure we have a valid status
	if(args.status && sprintly_api.item.valid.status.indexOf(args.status) === -1)
	{
		sprintly_api.debug('error', 'Invalid Status');
		return null;
	}
	else if(typeof args.status === 'undefined')
	{
		args.status = 'someday';
	}

	// Make sure assigned_to is correct
	if(args.assigned_to && typeof args.assigned_to !== 'number')
	{
		sprintly_api.debug('error', 'Invalid assigned_to');
		return null;
	}

	// Let's check for tags
	if(args.tags && typeof args.tags === 'object')
	{
		args.tags = args.tags.join();
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items.json',
			function(data)
			{
				sprintly_api.item.data.new_item = data;
				sprintly_api.track('API', 'Item', 'Add Success');
			},
			function(error)
			{
				sprintly_api.item.data.new_item = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Item', 'Add Error: ' + error);
				sprintly_api.debug('error', 'Add Item Error: ' + error);
			},
			args,
			'POST'
		);

		sprintly_api.track('API', 'Item', 'Add: ' + JSON.stringify(args));
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.new_item;
};
sprintly_api.item.archive = function(item_id)
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
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'.json',
			function(data)
			{
				sprintly_api.item.data.archive_item = data;
				sprintly_api.track('API', 'Item', 'Archive Success');
			},
			function(error)
			{
				sprintly_api.item.data.archive_item = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Item', 'Archive Error: ' + error);
				sprintly_api.debug('error', 'Archive Item Error: ' + error);
			},
			null,
			'DELETE'
		);

		sprintly_api.track('API', 'Item', 'Archive: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.archive_item;
};
sprintly_api.item.children = function(item_id)
{
	// Make sure we have a type defined
	if(typeof item_id !== 'number')
	{
		sprintly_api.debug('error', 'Invalid Item ID');
		return null;
	}

	// Fetch original item to validate requirements
	var item = sprintly_api.item.get(item_id);

	// Make sure we are only dealing with stories
	if(item.type !== 'story')
	{
		sprintly_api.debug('error', 'Only items with a type of "story" can have child items.');
		return null;
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'/children.json',
			function(data)
			{
				sprintly_api.item.data.item_children = data;
				sprintly_api.track('API', 'Item', 'Children Success');
			},
			function(error)
			{
				sprintly_api.item.data.item_children = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Item', 'Children Error: ' + error);
				sprintly_api.debug('error', 'Item Children Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Item', 'Children: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.item_children;
};
sprintly_api.item.get = function(item_id)
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
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'.json',
			function(data)
			{
				sprintly_api.item.data.get_item = data;
				sprintly_api.track('API', 'Item', 'Get Success');
			},
			function(error)
			{
				sprintly_api.item.data.get_item = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Item', 'Get Error: ' + error);
				sprintly_api.debug('error', 'Get Item Error: ' + error);
			}
		);

		sprintly_api.track('API', 'Item', 'Get: ' + item_id);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.get_item;
};
sprintly_api.item.list = function()
{
	sprintly_api.track('API', 'Item', 'Get List');

	var date = new Date();
	var now = date.getTime();

	// Check for Fresh Cache
	if(typeof sprintly_api.item.last_update.list !== 'undefined' && typeof sprintly_api.item.data.list !== 'undefined')
	{
		if(now - sprintly_api.item.last_update.list <= sprintly_api.settings.time_until_stale)
		{
			sprintly_api.debug('log', 'Ignoring API call since data is not old');

			return sprintly_api.item.data.list;
		}
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items.json',
			function(data)
			{
				var date = new Date();

				sprintly_api.item.last_update.list = date.getTime();
				sprintly_api.item.data.list = data;
				sprintly_api.track('API', 'Item', 'Success');
			},
			function(error)
			{
				sprintly_api.item.data.list = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Item', 'Error: ' + error);
				sprintly_api.debug('error', 'Item List Error: ' + error);
			}
		);
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.list;
};
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
				sprintly_api.item.data.search_results = sprintly_api.ajax.responseJSON;
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
sprintly_api.item.set = function(item_id, args)
{
	// Fetch original item to validate requirements
	var item = sprintly_api.item.get(item_id);

	// Make sure we have a title if its not a story
	if(item.type !== 'story' && typeof args.title === 'undefined')
	{
		sprintly_api.debug('error', 'Title Not Provided');
		return null;
	}

	// Make sure we have a who if it is a story
	if(item.type === 'story' && typeof args.who === 'undefined')
	{
		sprintly_api.debug('error', 'Who Not Provided for Story');
		return null;
	}

	// Make sure we have a what if it is a story
	if(item.type === 'story' && typeof args.what === 'undefined')
	{
		sprintly_api.debug('error', 'Who Not Provided for Story');
		return null;
	}

	// Make sure we have a why if it is a story
	if(item.type === 'story' && typeof args.why === 'undefined')
	{
		sprintly_api.debug('error', 'Who Not Provided for Story');
		return null;
	}

	// Make sure description is correct
	if(args.description && typeof args.description !== 'string')
	{
		sprintly_api.debug('error', 'Invalid Description');
		return null;
	}

	// Make sure we have a valid description
	if(args.score && sprintly_api.item.valid.score.indexOf(args.score) === -1)
	{
		sprintly_api.debug('error', 'Invalid Score');
		return null;
	}
	else if(typeof args.score === 'undefined')
	{
		args.score = '~';
	}

	// Make sure we have a valid status
	if(args.status && sprintly_api.item.valid.status.indexOf(args.status) === -1)
	{
		sprintly_api.debug('error', 'Invalid Status');
		return null;
	}
	else if(typeof args.status === 'undefined')
	{
		args.status = 'someday';
	}

	// Make sure assigned_to is correct
	if(args.assigned_to && typeof args.assigned_to !== 'number')
	{
		sprintly_api.debug('error', 'Invalid assigned_to');
		return null;
	}

	// Let's check for tags
	if(args.tags && typeof args.tags === 'object')
	{
		args.tags = args.tags.join();
	}

	// Make API call if we have a product selected
	if(sprintly_api.product.selected)
	{
		sprintly_api.call(
			'products/'+ sprintly_api.product.selected +'/items/'+ item_id +'.json',
			function(data)
			{
				sprintly_api.item.data.set_item = data;
				sprintly_api.track('API', 'Item', 'Set Success');
			},
			function(error)
			{
				sprintly_api.item.data.set_item = sprintly_api.ajax.responseJSON;
				sprintly_api.track('API', 'Item', 'Set Error: ' + error);
				sprintly_api.debug('error', 'Set Item Error: ' + error);
			},
			args,
			'POST'
		);

		sprintly_api.track('API', 'Item', 'Set: ' + JSON.stringify(args));
	}
	else
	{
		sprintly_api.debug('error', 'No Product Selected');
	}

	return sprintly_api.item.data.set_item;
};
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
				sprintly_api.people.data.deleted_person = sprintly_api.ajax.responseJSON;
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
				sprintly_api.people.data.person = sprintly_api.ajax.responseJSON;
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
				sprintly_api.people.data.invite = sprintly_api.ajax.responseJSON;
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