# MockQA

**MockQA is a tool that you can use to easily write and run functional tests for web projects that use jQuery.**

## Demo

http://mennovanslooten.github.com/mockqa/demo/demo-backbone/index.html

Open the MockQA menu on the right by hovering your mouse over it, then click a test to run it.

## Why MockQA?

MockQA has the following design goals:

1. Zero install and minimal configuration. No browser plugins necessary.
2. Easy to write tests.
3. Automatically continues test after page loads and form submits.
4. Automatically waits for asynchronous activities like Ajax calls and animations to complete.
5. You can see and debug tests running in a browser.

## Installation

1. Download and extract the [ZIP](https://github.com/mennovanslooten/mockqa/archive/master.zip), or clone from [GitHub](https://github.com/mennovanslooten/mockqa).
2. Copy the `mockqa` subdirectory into your project. 
3. Include `mockqa.js` after jQuery in your HTML.

Example:

    <script src="js/jquery.min.js"></script>
    <script src="mockqa/mockqa.js"></script>


## Writing tests

Tests are written in a special format designed for simplicity and readability. This is best illustrated with an example:

    # This is a commment. Comments and empty lines are ignored
    
    # Every line is a command. Commands have an action and a target.
    # [action]        [target]
    
    click             #my-button
    
    # Some actions require an extra argument
    # [action]        [target]         [argument]
    
    type              #my-input        Hello, world.
    
    # Actions, targets and arguments are separated by 2 or more spaces. 
    # I recommend at least 4 for optimal readability.
    
	# Targets are CSS selectors like #some-id, .some-class or a[href]. 
	# jQuery extensions like :text and :password are also allowed.
	# In fact, everything that jQuery allows is allowed. 
	# See: http://api.jquery.com/category/selectors/

    click             a.tab:not(.active):contains("Click me")
	
	# Asserts are special kinds of commands that test the page for a certain condition.
	# If an assert fails, the test is cancelled. 
	
	# Test if at least one element with class="foobar" is visible:
	assertVisible    .foobar
	
	# Test if the submit button has the text "GO!":
	assertText       :submit            GO!
    
    # Some asserts don't require a target
    assertTitle       MockQA Homepage Title
 

## Including tests

To include a test:

1. Save it in the directory `mockqa/tests`. 
2. Add a reference to it in the file `mockqa/tests/testlist`. 

Let's say you added two test files called `test_1` and `test_2` and you want to run these on the pages `index.html` and `foo.html`. The file `testlist` should look something like this.

    # test filename       test start page
    
    test_1                index.html
    test_2                index.html
    test_1                foo.html
    test_2                foo.html

## Running tests

To run this test, simply open `index.html` or `foo.html` in a browser and hover over the MockQA menu on the right. Click a test name to start that test.

## MORE TO COME
