<?php
if (!isset($TEMPLATE)) {
  $TITLE = 'Collection SelectBox Example';
  $NAVIGATION = true;
  $HEAD = '
    <link rel="stylesheet" href="hazdev-webutils.css"/>
  ';

  $FOOT = '
    <script src="hazdev-webutils.js"></script>
    <script src="CollectionSelectBoxUITest.js"></script>
  ';
}

include '_example.inc.php';
?>

<section>
  <h2>Same Collection</h2>
  <p>
    Below are two select views that are bound to the same collection. By
    selecting an item in either select box, the select items in both box select
    boxes should update.
  </p>
  <select id="selectBox1"></select>
  <select id="selectBox2"></select>

  <p>
    Use the buttons below to add, remove, or clear items to/from the underlying
    collection. You should see the results of your action reflected in both
    select boxes above.
  </p>

  <button id="addItem">Add New Item</button>
  <button id="removeItem">Remove First Item</button>
  <button id="resetItems">Clear All Items</button>
</section>

<hr />

<section>
  <h2>Include Blank Option</h2>
  <p>
    This select box uses the *includeBlankOption* key.
  </p>

  <select id="selectBox3"></select>
  <p>
    The selected model looks like this:
  </p>
  <span id="output"></span>
</section>
