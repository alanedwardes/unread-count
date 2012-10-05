function Worker()
{
	this.settings = new Settings();
	this.uniqueClassId = 'unreadCountExtension' + new Date().getTime();
	this.canvas = false;
	this.setCanvas = function(canvas) { this.canvas = canvas; }
	
	this.work = function()
	{
		var queryInfo = { status: "complete" };
		if (this.settings.get(this.settings.names.pinnedOnly))
		{
			queryInfo.pinned = true;
		}
		var context = this;
		chrome.tabs.query(queryInfo, function(tabs) {
			for (var i = 0; i < tabs.length; i++)
			{
				context.processTab(tabs[i]);
			}
		});
	}
	
	this.allowedURL = function(url)
	{
		var includedSites = this.settings.get(this.settings.names.includedSites);
		var excludedSites = this.settings.get(this.settings.names.excludedSites);
		
		var match = false;
		for (var i = 0; i < includedSites.length; i++)
		{
			var site = includedSites[i];
			if (url.match(site))
			{
				match = true;
				break;
			}
		}
		
		if (match)
		{
			for (var i = 0; i < excludedSites.length; i++)
			{
				var site = excludedSites[i];
				if (url.match(site))
				{
					match = false;
					break;
				}
			}
		}
		
		return match;
	}
	
	this.extractCountFromTitle = function(title)
	{
		var titleInt = title.match(/\(([0-9]+)\)/g);
		if (!titleInt)
		{
			return 0;
		}
		
		return parseInt(titleInt[0].match(/[0-9]+/g));
	}
	
	this.tabIcons = {};
	this.getAndCreateTabIcon = function(tab)
	{
		if (this.tabIcons[tab.id])
		{
			return this.tabIcons[tab.id];
		}
		else if (!tab.favIconUrl)
		{
			return false;
		}
		else
		{
			var count = new Count();
			count.setCanvas(this.canvas);
			count.setFavicon(tab.favIconUrl);
			this.tabIcons[tab.id] = count;
		}
	}
	
	this.activeNotifications = [];
	this.createNotification = function(generatedIcon, count, tab)
	{
		var notification = webkitNotifications.createNotification(generatedIcon, count + " Items", "Test");
		this.activeNotifications.push({ notification: notification, tab: tab });
		var context = this;
		notification.onclose = function(e)
		{
			alert('notification close');
			var index = context.activeNotifications.indexOf(notification);
			if (index > -1)
			{
				this.activeNotifications.splice(index, 1);
			}
		}
		notification.show();
	}
	
	this.processTab = function(tab)
	{
		if (!this.allowedURL(tab.url)) return;		
		var tabIcon = this.getAndCreateTabIcon(tab);
		if (!tabIcon) return;
		
		if (!tabIcon.faviconLoaded) return;
		
		var count = this.extractCountFromTitle(tab.title);
		
		//console.log(tab.url + " has " + count + " unread items.");
		
		tabIcon.setCount(count);
		
		var generatedIcon = tabIcon.generate();
		
		this.setTabIcon(tab, generatedIcon);
		
		if (this.settings.get(this.settings.names.showNotifications))
		{
			this.createNotification(generatedIcon, count, tab);
		}
	}
	
	this.setTabIcon = function(tab, icon)
	{
		chrome.tabs.sendMessage(tab.id, {
			action: "changeFavicon",
			classId: this.uniqueClassId,
			faviconUrl: icon
		});
	}
}