// list from here: http://www.lalit.org/lab/javascript-css-font-detect/
// I'm using the wonderful font detector script, too.
var fonts = 
[
	'cursive', 'monospace', 'serif', 'sans-serif', 'fantasy', 'default',
	'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold',
	'Bookman Old Style', 'Bradley Hand ITC', 'Century', 'Century Gothic',
	'Comic Sans MS', 'Courier', 'Courier New', 'Georgia', 'Gentium', 'Impact',
	'King', 'Lucida Console', 'Lalit', 'Modena', 'Monotype Corsiva', 'Papyrus',
	'Tahoma', 'TeX', 'Times', 'Trebuchet MS', 'Verdana', 'Verona'
];

function load()
{
	document.getElementById("reset").addEventListener("click", reset, false);
	var fontDetector = new Detector();
	
	if(fontDetector.test('Tahoma'))
	{
		defaults['font-family'] = 'Tahoma';
	}
	else
	{
		// Everyone has Arial.
		defaults['font-family'] = 'Arial';
	}
	
	var fontOptions = '<option>Times New Roman</option>';
	for(font in fonts)
	{
		if(fontDetector.test(fonts[font]))
		{
			fontOptions += '<option>' + fonts[font] + '</option>';
		}
	}
	document.getElementById('font-family').innerHTML = fontOptions;
	
	for(key in defaults)
	{
		element = document.getElementById(key);
		if(element)
		{
			setElement(element, key, getSetting(key, defaults[key]));
			element.addEventListener('keyup', saveSettingFromEvent, false);
			element.addEventListener('mouseup', saveSettingFromEvent, false);
			element.addEventListener('change', saveSettingFromEvent, false);
		}
	}
}

function setElement(element, key, value, dontset)
{
	if(element.id.match('font-family'))
	{
		element.style.fontFamily = value;
	}
	if(element.id.match('colour'))
	{
		element.style.background = value;
	}
	if(element.type == 'checkbox')
	{
		if(value)
		{
			element.checked = 'checked';
		}
		else
		{
			element.checked = '';
		}
	}
	else if(!dontset)
	{
		element.value = value;
	}
}

function reset()
{
	for(key in defaults)
	{
		element = document.getElementById(key);
		if(element)
		{
			setElement(element, key, defaults[key]);
			saveSetting(key, defaults[key]);
		}
	}
}

function saveSetting(key, value)
{
	console.log(key + ': ' + value);
	localStorage[key] = value;
}

function saveSettingFromEvent(e)
{
	if(e.srcElement.type == 'checkbox')
	{
		if(e.srcElement.checked)
		{
			e.srcElement.value = 'on';
		}
		else
		{
			e.srcElement.value = '';
		}
	}
	saveSetting(e.srcElement.id, e.srcElement.value);
	//setElement(e.srcElement, e.srcElement.id, e.srcElement.value, true);
}

window.addEventListener("load", load, false);