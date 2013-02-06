
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
`mockjax`  | 1          | Stops intercepting requests to [argument1]
