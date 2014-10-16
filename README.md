Sprint.ly API Javascript Library
===

Introduction
---

This is a Javascript Library to make calls to [Sprint.ly's API](https://github.com/sprintly/sprint.ly-docs).

__NOTE:__ Sprintly.js currently requires [jQuery](http://jquery.com/) for CORS AJAX Calls ( this was easier than writing something custom ... feel free to contribute to remove this requirement ).

Sprintly.js is ready to use and you can start by downloading either the __[sprintly.js](https://raw.githubusercontent.com/manifestinteractive/sprintly.js/stable/lib/sprintly.js)__ or __[sprintly.min.js](https://raw.githubusercontent.com/manifestinteractive/sprintly.js/stable/lib/sprintly.min.js)__ file into your project.

If you would like to modify it, see the __[Build Instructions](#build)__ below.

Enjoy !!!

-- Peter Schmalfeldt [@mrmidi](https://twitter.com/mrmidi)

Usage Instructions (TOC):
---

* __[Authentication](#authentication)__
* __[Products](#products)__
* __[People](#people)__
	* [Fetch People List](#people-list)
	* [Get a Specific User](#people-get)
	* [Invite a New User](#people-invite)
	* [Delete a Specific User](#people-delete)
* __[Items](#items)__
	* [Fetch Product Item List](#items-list)
	* [Searching Items](#items-search)
	* [Adding a New Item](#items-add)
	* [Getting a list of items tied to a Specific Story](#items-children)
	* [Getting a Specific Item](#items-get)
	* [Updating a Specific Item](#items-update)
	* [Deleting / Archiving a Specific Item](#items-delete)
* __[Comments](#comments)__
	* [Fetch Comment List](#comments-list)
    * [Get a Specific Comment](#comments-get)
    * [Add a New Comment](#comments-add)
    * [Delete a Specific Comment](#comments-delete)
* __[Favorites](#favorites)__
	* [Fetch Favorites List](#favorites-list)
    * [Get a Specific Favorite](#favorites-get)
    * [Add a New Favorite](#favorites-add)
    * [Delete a Specific Favorite](#favorites-delete)
* __[Blocking](#blocking)__
	* [Fetch Blocking List](#blocking-list)
    * [Get a Specific Blocking Item](#blocking-get)
    * [Add a New Blocking Status](#blocking-add)
    * [Delete a Specific Blocking Status](#blocking-delete)

<a name="authentication"></a>[» AUTHENTICATION](https://github.com/sprintly/sprint.ly-docs/blob/master/API/Authentication.mkd)
---

__IMPORTANT:__ Before you can use sprintly.js you will need to set your `sprintly_api.auth.email` and `sprintly_api.auth.api_key`.

You can find your API information by logging into [Sprint.ly](https://sprint.ly) and accessing your account profile.

__EXAMPLE HTML:__

```html
<!DOCTYPE html>
<html>
    <head>
      <title>Sprintly.js</title>
    </head>
    <body>
        <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
        <script src="lib/sprintly.js"></script>
        <script>
            // You'll want to do something more secure than this, but you get the idea
            sprintly_api.auth.email = 'me@myemail.com';
            sprintly_api.auth.api_key = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
        </script>
        <script src="js/my_code.js"></script>
    </body>
</html>
```

<a name="products"></a>[» PRODUCTS](https://github.com/sprintly/sprint.ly-docs/blob/master/API/Products.mkd)
---

Before you can make any other API calls, you first need to pick which product you are going to be working with. To do this, you can fetch a list of products supported with your API Key.

```javascript
var products = sprintly_api.product.list();
```

If you only have one active product, that product will automatically be selected as your default project.  If you have more than one active product in Sprintly, you will need to specify which one you are working with before moving on.

```javascript
var selected_product = 0; // Possibly derived from a select list of products
sprintly_api.product.selected = products[selected_product].id;
```

<a name="people"></a>[» PEOPLE](https://github.com/sprintly/sprint.ly-docs/blob/master/API/People.mkd):
---

With a valid option set for `sprintly_api.product.selected` you can now start interacting with People Items.

__[SEE SPRINTLY'S _PEOPLE_ API DOCS](https://github.com/sprintly/sprint.ly-docs/blob/master/API/People.mkd)__ for extended usage & output details.

#### › <a name="people-list"></a>Fetch People List

You can quickly get a list of all People assigned to `sprintly_api.product.selected` via:

```javascript
var people = sprintly_api.people.list();
```

#### › <a name="people-get"></a>Get a Specific User

Get a single user by their user id

```javascript
var person = sprintly_api.people.get( person_id );
```

#### › <a name="people-invite"></a>Invite a New User

Invite a new user with default privileges:

```javascript
var invite_user = sprintly_api.people.invite('John', 'Doe', 'john.doe@sprint.ly');
```

Invite a new user with administrative privileges:

```javascript
var invite_admin = sprintly_api.people.invite('Jane', 'Doe', 'jane.doe@sprint.ly', true);
```

#### › <a name="people-delete"></a>Delete a Specific User

Delete a single user by their user id

```javascript
var delete_person = sprintly_api.people.delete( person_id );
```

<a name="items"></a>[» ITEMS](https://github.com/sprintly/sprint.ly-docs/blob/master/API/Products.mkd)
---

With a valid option set for `sprintly_api.product.selected` you can now start interacting with Product Items.

__[SEE SPRINTLY'S _ITEMS_ API DOCS](https://github.com/sprintly/sprint.ly-docs/blob/master/API/Items.mkd)__ for extended usage & output details.

#### › <a name="items-list"></a>Fetch Product Item List

You can quickly get a list of all Product Items via:

```javascript
var item_list = sprintly_api.item.list();
```

#### › <a name="items-search"></a>Searching Items

If you would like to search for a specific item, you can use something like:

```javascript
var search_results = sprintly_api.item.search({
    status: 'accepted',
    type: 'task'
});
```

#### › <a name="items-add"></a>Adding a New Item

Here is an Example on adding a new Task:

```javascript
var new_item = sprintly_api.item.add({
    type: 'task',
    title: 'Testing',
    score: 'S',
    status: 'backlog',
    assigned_to: 1,
    description: 'This is a test description.',
    tags: ['test', 'abc', '123']
});
```

Here is an Example on adding a new Story:

```javascript
var new_item = sprintly_api.item.add({
    type: 'story',
    who: "Accountant",
    what: "Quickbooks integartion",
    why: "I don't have to important CSVs daily",
    score: 'S',
    status: 'backlog',
    assigned_to: 1,
    description: "This is a test description.",
    tags: ['test', 'abc', '123']
});
```

#### › <a name="items-children"></a>Getting a list of items tied to a Specific Story

Get a list of items from a Stories unique ID:

```javascript
var item_children = sprintly_api.item.children( item_id );
```

#### › <a name="items-get"></a>Getting a Specific Item

Get an item by its unique ID:

```javascript
var my_item = sprintly_api.item.get( item_id );
```

#### › <a name="items-update"></a>Updating a Specific Item

Update an item by its unique ID:

```javascript
var update_item = sprintly_api.item.set( item_id , {
    title: 'Testing',
    score: 'S',
    status: 'backlog',
    assigned_to: 123,
    description: 'This is a fun test description.',
    tags: ['test', 'abc', '123']
});
```

#### › <a name="items-delete"></a>Deleting / Archiving a Specific Item

Deleting / Archiving an item by its unique ID:

```javascript
var archive_item = sprintly_api.item.archive( item_id );
```

NOTE: The Sprintly API does not allow for destructive calls, so deleting an item actually Archives it.

<a name="comments"></a>[» COMMENTS](https://github.com/sprintly/sprint.ly-docs/blob/master/API/Comments.mkd)
---

With a valid option set for `sprintly_api.product.selected` you can now start interacting with Item Comments.

__[SEE SPRINTLY'S _COMMENTS_ API DOCS](https://github.com/sprintly/sprint.ly-docs/blob/master/API/Comments.mkd)__ for extended usage & output details.

#### › <a name="comments-list"></a>Fetch Comment List

You can quickly get a list of all comments for an item assigned to `sprintly_api.product.selected` via:

```javascript
var item_comments = sprintly_api.comment.list( item_id );
```

#### › <a name="comments-get"></a>Get a Specific Comment

Get a single comments by its user id

```javascript
var first_comment = sprintly_api.comment.get( item_id, comment_id );
```

#### › <a name="comments-add"></a>Add a New Comment

Add a new comment to an item:

```javascript
var new_comment = sprintly_api.comment.add( item_id, 'This is one sassy comment.' );
```

#### › <a name="comments-delete"></a>Delete a Specific Comment

Delete a single comment by its id

```javascript
var delete_comment = sprintly_api.comment.delete( item_id, comment_id );
```

<a name="favorites"></a>[» FAVORITES](https://github.com/sprintly/sprint.ly-docs/blob/master/API/Favorites.mkd)
---

With a valid option set for `sprintly_api.product.selected` you can now start interacting with Item Favorites.

__[SEE SPRINTLY'S _FAVORITES_ API DOCS](https://github.com/sprintly/sprint.ly-docs/blob/master/API/Favorites.mkd)__ for extended usage & output details.

#### › <a name="favorites-list"></a>Fetch Favorites List

You can quickly get a list of all favorites for an item assigned to `sprintly_api.product.selected` via:

```javascript
var favorites = sprintly_api.favorite.list( item_id );
```

#### › <a name="favorites-get"></a>Get a Specific Favorite

Get a single favorite by its user id

```javascript
var favorite = sprintly_api.favorite.get( item_id, favorite_id );
```

#### › <a name="favorites-add"></a>Add a New Favorite

Add a new favorite to an item:

```javascript
var new_favorite = sprintly_api.favorite.add( item_id );
```

#### › <a name="favorites-delete"></a>Delete a Specific Favorite

Delete a single favorite by its id

```javascript
var deleted_favorite = sprintly_api.favorite.delete( item_id, favorite_id );
```


<a name="blocking"></a>[» BLOCKING](https://github.com/sprintly/sprint.ly-docs/blob/master/API/Blocking.mkd)
---

With a valid option set for `sprintly_api.product.selected` you can now start interacting with Item Blocking.

__[SEE SPRINTLY'S _BLOCKING_ API DOCS](https://github.com/sprintly/sprint.ly-docs/blob/master/API/Blocking.mkd)__ for extended usage & output details.

#### › <a name="blocking-list"></a>Fetch Blocking List

You can quickly get a list of all blocking items assigned to `sprintly_api.product.selected` via:

```javascript
var blocking_list = sprintly_api.blocking.list( item_id );
```

#### › <a name="blocking-get"></a>Get a Specific Blocking Item

Get a blocking by its item id

```javascript
var blocking = sprintly_api.blocking.get( item_id, blocking_id );
```

#### › <a name="blocking-add"></a>Add a New Blocking Status

Add blocking to an item:

```javascript
var new_blocking = sprintly_api.blocking.add( item_id );
```

#### › <a name="blocking-delete"></a>Delete a Specific Blocking Status

Delete blocking from an item

```javascript
var deleted_blocking = sprintly_api.blocking.delete( item_id, blocking_id );
```

<a name="build"></a>Node.js Build Requirements
---

* [Node.js v10+](http://nodejs.org/) ( For Grunt Development )

Node.js Build Setup
---

### Building with Node.js:

This project uses Grunt to package separate development files together.  This makes the development process easier as large components are broken up into logical smaller files.

This also means that you __SHOULD NOT__ be editing files in the `lib` folder as these files are built via grunt.

```bash
cd /path/to/sprintly.js
npm install
grunt
```

### Watching for Code Changes:

To take advantage of Grunt during the development process, you just need to run the following command to watch for any file changes setup to rebuild the scripts used in the app.


```bash
cd /path/to/sprintly.js
grunt watch
```

License
===

![OSI Approved License](http://opensource.org/trademarks/opensource/OSI-Approved-License-100x137.png "OSI Approved License")

![MIT license](http://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/License_icon-mit-2.svg/100px-License_icon-mit-2.svg.png "MIT license")

Currently licensed under the MIT license.
