# ParkingManagementMP
A parking system helping people to manage their parking lots. 
Users can organize together the parking timetable by booking parking spots( making requests), accepting requests/ rejecting requests( parking administrators).

There are 3 types of user:
1. admin - accept/ reject requests
2. members( registered users)
                   - no need for accept/ reject for his own parking spot
                   - can make requests to occupy other parking lots
3. unregistered users - can view the parking timetable                   

Authentification: There is a registration page.
Input form: making a request.
List of items: view requests.
Chart display: Users can see the most popular parking spots. A special chart will display the most popular parkings in a graph.
Intent: People will receive confirmation for their requests on email.

-------------------------------------------------------------------

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
 
 
