# MockQA

**MockQA is a Functional Testing tool for jQuery projects that has one design goal:**

> Enable front-end developers of all levels to write and run functional tests within minutes from their first encounter. Developers should spend time debugging software, not tests.

To achieve this, I focused on the following features:

1. Zero install and minimal configuration. No browser plugins, no command line.
2. An intuitive format that makes it easy to write tests.
3. You can see and debug tests running in a browser.

## Demo

http://mennovanslooten.github.com/mockqa/demo/demo-backbone/index.html

Open the MockQA menu on the right by hovering your mouse over it, then click a test to run it.

## Getting started

### Setup

1. Download and extract the [ZIP](https://github.com/mennovanslooten/mockqa/archive/master.zip), or clone from [GitHub](https://github.com/mennovanslooten/mockqa).
2. Copy the `mockqa` subdirectory into your project. 
3. Include `mockqa.js` after jQuery in your HTML.

Example:

    <script src="js/jquery.min.js"></script>
    <script src="mockqa/mockqa.js"></script>

### Writing tests

Tests are written in a special format designed for simplicity and readability:

    # This is a comment. Comments and empty lines are ignored
    
    # Other lines are commands. Most commands have an action and a target.
    # [action]        [target]
   
    click             #my-button
    
	# Targets are CSS selectors like #some-id, .some-class or a[href]. 
	# jQuery extensions like :text and :password are also allowed.
	# In fact, everything that jQuery allows is allowed. 
	# See: http://api.jquery.com/category/selectors/

    click             a.tab:not(.active):contains("Click me")
    
    # Some actions require an argument
    # [action]        [target]         [argument]
    
    type              #my-input        Hello, world.
    
    # Actions, targets and arguments are separated by 2 or more spaces. 
    # I recommend at least 4 for optimal readability.
	
	# Asserts are special kinds of commands that test the page for a certain condition.
	# If an assert fails, the test is cancelled. 
	
	# Test if at least one element with class="foobar" is visible:
	assertVisible    .foobar
	
	# Test if the submit button has the text "GO!":
	assertText       :submit            GO!
    
    # Some asserts don't require a target
    assertTitle       MockQA Homepage Title
 

### Including tests

To include a test:

1. Save it in the directory `mockqa/tests`. 
2. Add a reference to it in the file `mockqa/tests/testlist`. 

Let's say you added two test files called `test_1` and `test_2` and you want to run these on the pages `index.html` and `foo.html`. The file `testlist` should look something like this.

    # test filename       test start page
    
    test_1                index.html
    test_2                index.html
    test_1                foo.html
    test_2                foo.html

### Running tests

1. Open `index.html` or `foo.html` in a browser.
2. Hover over the MockQA menu on the right to open it.
3. Click a test name to start that test.

## Digging deeper

### Multi-page test

If you have a test that spans multiple HTML pages, for example because you click a link or submit a form in the middle, MockQA takes care of that automatically. As long as `mockqa.js` is included in all pages it will pick up the test where it left off:

    # fill in the login form
    type          input[name="user"]        menno
    type          input[name="password"]    test123
    
    # submit the form
    click         input[type="submit"]
    
    # we should now be on a new page
    assertText    h1                        Welcome, Menno!

### Dealing with asynchronous behavior

MockQA automatically waits for asynchronous activities like Ajax calls and animations to complete. 

    # This button triggers an ajax request:
    click         button
    
    # MockQA will automatically wait here
    assertText    #target                   Ajax response text

### Logging to the console

Logging is such a common activity, MockQA has a special syntax for it:

    ## This comment will be logged (note the double #)

### Mocking Ajax requests

In some situations it's nice to be able to mock Ajax requests to the server. Jonathan Sharp of [appendTo](http://www.appendto.com) wrote a brilliant jQuery plugin that will do just about anything. MockQA has a special action to set up the most common case: intercept requests to one file and respond with the contents of another.

    # This setup will mock requests to "ajax-response.html"
    # with the file "mockqa/tests/mockjax/mocked-response.html"
    mockjax       ajax-response.html      mocked-response.html

[Read more about mockjax](http://enterprisejquery.com/2010/07/mock-your-ajax-requests-with-mockjax-for-rapid-development/)


## API

### Actions

Action     | Target   | Argument  | Explanation
-----------|----------|-----------|------------
`click`    | required | no        | Clicks the target
`type`     | required | yes       | Types [argument] into the target
`dblclick` | required | no        | Double-clicks the target

All actions require `assertVisible` to pass for the target. Some actions are simulated by the excellent [syn](https://github.com/bitovi/syn) library by [bitovi](http://www.bitovi.com/). More actions like ``focus``, ``mouseover``, ``mouseout`` should be added soon.

### Asserts

Assert          | Target    | Argument | Explanation
----------------|-----------|----------|------------
`assertPage`    | no        | yes      | Asserts [argument] is in the current URL
`assertTitle`   | no        | yes      | Asserts [argument] is in the current window title
`assertVisible` | yes       | no       | Asserts target is visible
`assertHidden`  | yes       | no       | Asserts target is invisible or doesn't exist
`assertDisabled`| yes       | no       | Asserts target is disabled
`assertEnabled` | yes       | no       | Asserts target is enabled
`assertText`    | yes       | yes      | Asserts target's text contains [argument]
`assertNotClass`| yes       | yes      | Asserts target's CSS class does not contain [argument]
`assertHasClass`| yes       | yes      | Asserts target's CSS class contains [argument]
`assertValue`   | yes       | yes      | Asserts target's value is [argument]
`assertLength`  | yes       | yes      | Asserts [argument] number of visible elements match [target]
`assertEmpty`   | yes       | yes      | Asserts target has no children

### Helpers

Helpers are neither actions nor asserts: they help setup the behavior of the test environment. Helpers don't have a target on the page but can have multiple arguments.

Action     | Arguments  | Explanation
-----------|------------|------------------------
`mockjax`  | 2          | Intercepts Ajax requests to [argument1] with contents of [argument2]
