init();
var index = 0;
var item;
var itemsTmp;
var yesCounter;

function init() {
	document.getElementById("btnSave").addEventListener("click", save);
	document.getElementById("btnDeleteAllData").addEventListener("click", deleteAllData);
	document.getElementById("btnShowData").addEventListener("click", showData);
	document.getElementById("btnLoadData").addEventListener("click", loadData);
	document.getElementById("btnNewTest").addEventListener("click", newTest);
	document.getElementById("yes").addEventListener("click", () => {
		answer('yes')
	});
	document.getElementById("no").addEventListener("click", () => {
		answer('no')
	});
	document.getElementById("checkbox").addEventListener("change", onChangeCheckbox);
};

function onChangeCheckbox() {
	if (document.getElementById("checkbox").checked) {
		document.getElementById("dataDiv").style.display = 'block';
	} else {
		document.getElementById("dataDiv").style.display = 'none';
	}
}

/**
 * This function save the data in the database
 */
function save() {
	let key = document.getElementById("word").value;
	if (key == '') {
		alert('please set a word');
		return;
	}
	let statement = document.getElementById("statement").value
	if (statement == '') {
		alert('please set a statement');
		return;
	}

	let word = {
		key: key,
		statement: statement,
		counter: 0,
		success: 0,
		percentage: 0

	}
	saveItem(word);
	document.getElementById("word").value = '';
	document.getElementById("statement").value = '';
}

/**
 * This function save the data in the database
 */
function saveItem(item) {
	// Save the word object in the browser database
	localStorage.setItem(item.key, JSON.stringify(item));
}

function saveItems(items) {
	for (var item of items) {
		saveItem(item);
	}

}

function getItems(size) {
	size = (size) ? (size > localStorage.length ? localStorage.length : size) : localStorage.length;
	let items = [];
	if (localStorage.length == 0) {
		return items;
	}
	for (var i = 0; i < size; i++) {
		var key = localStorage.key(i);
		var value = JSON.parse(localStorage[key]);
		items.push(value);
	}
	return items;
}

/**
 * This function shows the saved data in the batabase
 */
function showData() {
	let items = sortItems(getItems());
	let text = '';
	text += '<table style="width:80%">';
	text += '  <tr>';
	//text += '    <th></th>';
	text += '    <th>Word</th>';
	text += '    <th>Statement</th>';
	text += '    <th>Counter&nbsp;&nbsp;</th>';
	text += '    <th>Success&nbsp;&nbsp;</th>';
	text += '    <th>Percentage&nbsp;&nbsp;</th>';
	text += '  </tr>';

	let index = 0;

	for (var item of items) {
		text += '  <tr>';
		//text += '    <td>' + (++index) + '</td>';
		text += '    <td>' + item.key + '</td>';
		text += '    <td>' + item.statement + '</td>';
		text += '    <td>' + item.counter + '</td>';
		text += '    <td>' + item.success + '</td>';
		text += '    <td>' + item.percentage + ' %</td>';
		text += '  </tr>';
	}
	text += '</table>';
	document.getElementById('table').innerHTML = text;
}

/**
 * This function delete all data of the database
 */
function deleteAllData() {
	localStorage.clear();
	showData();
}

function loadData() {
	let data = document.getElementById('data').value;
	if (data == '') {
		alert("The textarea doesn't have text");
		return;
	}
	data = data.split('\n');
	deleteAllData();
	for (let item of data) {
		item = item.split('\t');
		if (item.length < 2) {
			continue;
		}
		let key = item[0].trim();
		let word = {
			key: key,
			statement: item[1].trim(),
			counter: (item[2]) ? parseInt(item[2].trim()) : 0,
			success: (item[3]) ? parseInt(item[3].trim()) : 0,
			percentage: (item[4]) ? parseInt(item[4].replace('%', '').trim()) : 0
		}
		localStorage.setItem(key, JSON.stringify(word));
	}
	showData();
	document.getElementById("checkbox").checked = false;
	onChangeCheckbox();
}

/**
 * This function sort the items by the percentage
 */
function sortItems(items) {
	items.sort(function (a, b) {
		return (a.percentage < b.percentage) ?
			// if percentage A is less than B return -1
			-1 :
			// if percentage A is NOT less than B we make another comparation
			((a.percentage > b.percentage) ?
				// if percentage A is more than B return 1
				1 :
				// if percentage A is NOT more than B means that are equials
				// We make another comparation, we take in count the counter value
				(a.counter < b.counter ? -1 : 1));
	});
	return items;
}

/*******************************************************************
 *							NEW TEST BUTTON
 ********************************************************************/

function newTest() {
	index = 0;
	yesCounter = 0;
	document.getElementById('test').style.display = 'block';
	let items = getItems();
	itemsTmp = sortItems(items).slice(0, 10);
	showNextItem();
}

function showNextItem() {
	document.getElementById('status').innerHTML = 'Test ' + (index + 1) + ' of 10';
	item = itemsTmp[index++];
	document.getElementById('wordTest').innerHTML = item.key;
	document.getElementById('statementTest').innerHTML = item.statement;
}

function answer(button) {
	var counter = item.counter + 1;
	var success = item.success;
	if (button === 'yes') {
		success++;
		yesCounter++;
	}
	item.counter = counter;
	item.success = success;
	item.percentage = parseInt(counter < 5 ? (success / 5 * 100) : (success / counter * 100));
	if (index > 9) {
		document.getElementById('test').style.display = 'none';
		document.getElementById('status').innerHTML = 'Finished the test your score is ' + yesCounter + '/10';
		showData();
		return;
	}
	showNextItem();
}
