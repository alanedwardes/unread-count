function changeFavicon(classId, faviconUrl)
{
	var linkElement = document.getElementById(classId);
	if (!linkElement)
	{
		linkElement = document.createElement('link');
		linkElement.type = 'image/png';
		linkElement.rel = 'shortcut icon';
		linkElement.id = classId
		if (document.head.children.length > 0)
		{
			document.head.insertBefore(linkElement, document.head.children[0]);
		}
		else
		{
			document.head.appendChild(linkElement);
		}
	}
	linkElement.href = faviconUrl;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse){
	if (!sender.tab) return;
	
    switch (request.action)
	{
		case "changeFavicon":
			return changeFavicon(request.classId, request.faviconUrl);
	}
});