function create_breadcrumbs(){
		// Create Page Title and Content Groups
		var ix = 0;
		var tl = "";
		//<![CDATA[
			// Initialize the groups so they are not NULL
			_tag.WT.cg_n = "PN - ";
			_tag.WT.cg_s = "";
			_tag.DCSext.cg_s3 = "";
			_tag.DCSext.cg_s4 = "";

			// Top level - if there's no tabs it's an FSM (Full Screen Message)
			if (!document.getElementById("current")) {
				top_link = document.createElement('a');
				if (window.opener){
					top_link.setAttribute('innerHTML', 'Documentum Page');
					tl = "Documentum Page";
				} else {
					top_link.setAttribute('innerHTML', 'FSM');
					tl = "FSM";
				}
			} else {
				var top_link = document.getElementById("current").getElementsByTagName("a")[0];
				tl = top_link.innerHTML;
			}
			// Test if we have an image in the link, if so leave it out
			if (tl.indexOf(".gif") != -1)
				_tag.WT.cg_n += tl.slice(tl.indexOf(">")+1,tl.length);
			else
				_tag.WT.cg_n += tl;		
		//]]>>
		
		//Bottom level, use as handle to access all layers. In case Bottom Level = a-menu item (currentpage undefined), top and bottom link are the same.
		var bottom_link = "";
		if (document.getElementById("currentpage") == undefined)
			bottom_link = top_link;	
		else
			bottom_link = document.getElementById("currentpage");	
		//Access all the layers
		if (bottom_link.parentNode){
			switch (bottom_link.parentNode.className){
				case "sublevel":
					//<![CDATA[
						_tag.WT.cg_s=bottom_link.innerHTML;
					//]]>>
					break;
					
				case "indentedsublevel":
					//Find the last anchor tag before the node switches from "sublevel" to "indentedsublevel"
					ix = get_lastanchor(bottom_link.parentNode.parentNode);
					//<![CDATA[
						_tag.WT.cg_s=bottom_link.parentNode.parentNode.getElementsByTagName("a")[ix].innerHTML;
						_tag.DCSext.cg_s3=bottom_link.innerHTML;
					//]]>>
					break;
				
				case "doubleindentedsublevel":
					//Find the last anchor tag before the node switches from "sublevel" to "indentedsublevel"
					ix = get_lastanchor(bottom_link.parentNode.parentNode);
					//<![CDATA[
						_tag.WT.cg_s=bottom_link.parentNode.parentNode.getElementsByTagName("a")[ix].innerHTML;
					//]]>>
					//The div at the "indentedsublevel" is a sibling to the "doubleindentedsublevel" div
					var sib = get_previoussibling(bottom_link.parentNode);
					ix = sib.getElementsByTagName("a").length - 1;
					//<![CDATA[
						_tag.DCSext.cg_s3=sib.getElementsByTagName("a")[ix].innerHTML;
						_tag.DCSext.cg_s4=bottom_link.innerHTML;
					//]]>>
					break;
			}
		}
		// Replace/remove special characters
		_tag.WT.cg_n = removeSpecialChar(_tag.WT.cg_n);
		_tag.WT.cg_s = removeSpecialChar(_tag.WT.cg_s);
		_tag.DCSext.cg_s3 = removeSpecialChar(_tag.DCSext.cg_s3);
		_tag.DCSext.cg_s4 = removeSpecialChar(_tag.DCSext.cg_s4);
		
		// Create Page Title from Content Groups
		// If a Content Group doesn't have a value, copy the previous one
		//<![CDATA[
			_tag.WT.ti = _tag.WT.cg_n;
			if (_tag.WT.cg_s != "")
				_tag.WT.ti += " - " + _tag.WT.cg_s;
			else
				_tag.WT.cg_s = _tag.WT.cg_n;
			
			if (_tag.DCSext.cg_s3 != "")
				_tag.WT.ti += " - " + _tag.DCSext.cg_s3;
			else
				_tag.DCSext.cg_s3 = _tag.WT.cg_s;
			
			if (_tag.DCSext.cg_s4 != "")
				_tag.WT.ti += " - " + _tag.DCSext.cg_s4;
			else
				_tag.DCSext.cg_s4 = _tag.DCSext.cg_s3;
		//]]>>
	}
	
	//Help function to find the element node, previousSibling provides different results in different browsers
	function get_previoussibling(n){
		x=n.previousSibling;
		while (x.nodeType!=1)
		{
		  x=x.previousSibling;
		}
		return x;
	}
	
	//Help function to find the last anchor tag before a new div-level, that anchor tag contains the breadcrum for that level
	function get_lastanchor(node){
		var classname=node.getElementsByTagName("a")[0].parentNode.className;
		var ix=0;
		var i=0;
		for (i=0; i<node.getElementsByTagName("a").length;i++){
			if (classname != node.getElementsByTagName("a")[i].parentNode.className)
				return ix;
			else
				ix=i;
		}
	}
	

	//---------------------------------------------------------------------------------------------------------------
	//  © Nordea Bank (publ) 
	//---------------------------------------------------------------------------------------------------------------
	//  
	// Auth: Christer Sjöholm
	// Date: 2013-02-18
	//  
	//  Summary:
	//  This function will remove all special characters and replace national characters with "a" or "o".
	//  Exception is made for "-", "/", " " and "&".
	//  
	//---------------------------------------------------------------------------------------------------------------
	function removeSpecialChar(txt){
		var outstr="";
		var sc="";
		var esctxt=escape(txt);
		for (var i = 0; i <= esctxt.length; i++){
			if (esctxt.charAt(i)=="%"){
				sc=esctxt.substr(i,3);
				switch(sc){
					case "%E4": 
						outstr+="a";
						break;
					case "%E5": 
						outstr+="a";
						break;
					case "%E6": 
						outstr+="a";
						break;
					case "%F6": 
						outstr+="o";
						break;
					case "%F8": 
						outstr+="o";
						break;
					case "%C4": 
						outstr+="A";
						break;
					case "%C5": 
						outstr+="A";
						break;
					case "%C6": 
						outstr+="A";
						break;
					case "%D6": 
						outstr+="O";
						break;
					case "%D8": 
						outstr+="O";
						break;
					case "%26": 
						outstr+="&";
						break;	
					case "%20": 
						outstr+=" ";
						break;	
				}
				i+=2;
			} else if (esctxt.charAt(i) >= "a" && esctxt.charAt(i) <= "z") {
				outstr+=esctxt.charAt(i);
			} else if (esctxt.charAt(i) >= "A" && esctxt.charAt(i) <= "Z") {
				outstr+=esctxt.charAt(i);
			} else if (esctxt.charAt(i) >= "0" && esctxt.charAt(i) <= "9") {
				outstr+=esctxt.charAt(i);
			} else if (esctxt.charAt(i) == "-" || esctxt.charAt(i) == "/") {
				outstr+=esctxt.charAt(i);
			} 			
		}
		return(outstr);
	}