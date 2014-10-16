/**
 * Sprintly API
 *
 * @link: https://github.com/sprintly/sprint.ly-docs
 * @type object
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