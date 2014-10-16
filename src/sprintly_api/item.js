/**
 * Sprintly API - Items
 *
 * The items API allows you to fetch items from your products via the API.
 * It gives access to various methods of filtering, adding blockers, favoriting items,
 * getting and item's comments, etc. Basically, if you need to query for an item,
 * or items, and manipulate them in some manner, this is the API you'd do it with.
 *
 * @link: https://github.com/sprintly/sprint.ly-docs/blob/master/API/Items.mkd
 * @type object
 */
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