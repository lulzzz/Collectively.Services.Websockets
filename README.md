![Collectively](https://github.com/noordwind/Collectively/blob/master/assets/collectively_logo.png)

----------------


|Branch             |Build status                                                  
|-------------------|-----------------------------------------------------
|master             |[![master branch build status](https://api.travis-ci.org/noordwind/Collectively.Services.Websockets.svg?branch=master)](https://travis-ci.org/noordwind/Collectively.Services.Websockets)
|develop            |[![develop branch build status](https://api.travis-ci.org/noordwind/Collectively.Services.Websockets.svg?branch=develop)](https://travis-ci.org/noordwind/Collectively.Services.Websockets/branches)

**Let's go for the better, Collectively​​.**
----------------

**Collectively** is an open platform to enhance communication between counties and its residents​. It's made as a fully open source & cross-platform solution by [Noordwind](https://noordwind.com).

Find out more at [becollective.ly](http://becollective.ly)

**Collectively.Services.Websockets**
----------------

The **Collectively.Services.Websockets** is a service responsible for pushing the real-time notifications e.g. about new or resolved remarks, to the end-users which makes the applications dynamically updatable.  

**Quick start**
----------------

## Docker way

Collectively is built as a set of microservices, therefore the easiest way is to run the whole system using the *docker-compose*.

Clone the [Collectively.Docker](https://github.com/noordwind/Collectively.Docker) repository and run the *start.sh* script:

```
git clone https://github.com/noordwind/Collectively.Docker
./start.sh
```

For the list of available services and their endpoints [click here](https://github.com/noordwind/Collectively).

## Classic way

In order to run the **Collectively.Services.Websockets** you need to have installed:
- [Node.js](https://nodejs.org)

Clone the repository and run the *start.sh* script:

```
git clone https://github.com/noordwind/Collectively.Services.Websockets
cd Collectively.Services.Websockets/src
npm install
npm start
```

Once executed, you shall be able to access the service at [http://localhost:9050](http://localhost:9050)

Please note that the following solution will only run the Websockets Service which is merely one of the many parts required to run properly the whole Collectively system.

**Configuration**
----------------

Please edit the specific *[environment].json* file that can be found under the *config* directory to use the custom application settings. To configure the docker environment update the *dockerfile* - if you would like to change the exposed port, you need to also update it's value that can be found within *start.sh*.
For the local testing purposes the *.local* or *.docker* configuration files are being used (for both *[environment].json* and *dockerfile*), so feel free to create or edit them.

**Tech stack**
----------------
- **[socket.io](https://socket.io)** - an open source & cross-platform framework for using websockets.