Lab3:
1. input form+ send collected data using an email( intent)
2. list of items
3. view item
4. edit item details

      React Native     |      Native
 1    done( Share)     |   done( Intent)
 2    done( ItemList)  |   done   
 3    done             |   done
 4    done             |   done

--------------------------------------------------------------------------

Lab5:
1. CRUD user interfaces.
2. Offline support (sync adapters).
3. Persist data on the local storage.
4. Display a chart when presenting item details.
5. Use dialogs and pickers.

      React Native     |      Native
 1                 ? ask S8 
 2                 ? off support( sync adapters)   
 3     AsyncStorage    |  
 4                 ? chart
 5     Picker/ Alert   |      Picker( TODO: alert)
 
 -------------------------------------------------------------------------
 
 Lab7:
 1. online support
 2. CRUD REST client operations
 3. notifications( gcm, ws etc)
 4. synchronize with remote location -> server
 5. authentication( jwt, oauth) -> 2 roles admin/ basic
 6. ? submit data on background threads/ using promises
 7. navigate between screens/ views
 8. ? manage app state outside UI layer
 9. Observer pattern -> to notify the user about the changes occurred internally
 10.Different layouts, depending on the device size( phone, tablet etc) -> responsive ui
 
      React Native     |      Native
 7        done         |       done      
 
  
--------------------------------------------------------------------------

Possible problems:
I. I have installed VirtualBox.
When I try to run react native app, with npm start, it picks the wrong IP which is in fact the VirtualBox IP, instead of the IP of my wireless network.

1. Connect laptop to wifi.
2. Click Run in Start Menu and type ncpa.cpl to open Network Connections, or open cmd and search for 'network connections'/ 'ipconfig'.
3. Right-Click on 'Wifi' > select 'Properties' > 'Internet Protocol Version 4 (TCP/IPv4)' [don't uncheck the mark]
   Go to "Properties" > "Advanced..." > (Uncheck 'Automatic Metric') > Type in the text-box below that (Interface Metric) : 10.
   Click OK and OK and OK :)
4. Do the same for the other "Virtual Box-xxxxx" networks. But instead put 20 in the Interface Metric text-box.
   Click OK, OK and OK.
Try restarting your app in Expo. It must work now!


II. Debugging:
npm install --save-dev react-devtools
add to scripts( in package.json): "react-devtools": "react-devtools"


---------------------------------------------------------------------------
