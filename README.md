# MockQA

**MockQA is a Functional Testing tool for jQuery projects that has one design goal:**

> MockQA should Enable front-end developers of all levels to write and run functional tests within minutes from their first encounter. Developers should spend time debugging software, not tests.

Tests are written in a special format designed for simplicity and readability:

```apache
# This is a comment. Comments and empty lines are ignored

# Other lines are commands. Most commands have an action and a target.

click             #my-button

# Targets are CSS selectors like #some-id, .some-class or a[href]. 
# jQuery extensions like :text and :password are also allowed.
# In fact, everything that jQuery allows is allowed. 
# See: http://api.jquery.com/category/selectors/

click             #container > a.tab:not(.active)

# Some actions require an argument

type              #my-input        Hello, world.

# Actions, targets and arguments are separated by 2 or more spaces. 
# I recommend at least 4 for optimal readability.

# Asserts are special kinds of commands that test the page for a certain condition.
# If an assert fails, the test fails. 

# Test if at least one element with class="foobar" is visible:
assertVisible    .foobar

# Test if the submit button has the text "GO!":
assertText       :submit            GO!

# Some asserts don't require a target
assertTitle       MockQA Homepage Title
```
 
MockQA isn't finished yet and severely lacking in documentation. For more information visit http://mennovanslooten.github.com/mockqa/.

