# ZAP Scanning Report

ZAP by [Checkmarx](https://checkmarx.com/).


## Summary of Alerts

| Risk Level | Number of Alerts |
| --- | --- |
| High | 0 |
| Medium | 0 |
| Low | 3 |
| Informational | 4 |




## Insights

| Level | Reason | Site | Description | Statistic |
| --- | --- | --- | --- | --- |
| Low | Exceeded High | http://localhost:3000 | Percentage of responses with status code 4xx | 97 % |
| Info | Informational | http://localhost:3000 | Percentage of responses with status code 2xx | 2 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with content type application/json | 100 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method GET | 55 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method PATCH | 11 % |
| Info | Informational | http://localhost:3000 | Percentage of endpoints with method POST | 32 % |
| Info | Informational | http://localhost:3000 | Count of total endpoints | 34    |







## Alerts

| Name | Risk Level | Number of Instances |
| --- | --- | --- |
| A Server Error response code was returned by the server | Low | 1 |
| Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s) | Low | Systemic |
| X-Content-Type-Options Header Missing | Low | 5 |
| A Client Error response code was returned by the server | Informational | 32 |
| Authentication Request Identified | Informational | 1 |
| Non-Storable Content | Informational | Systemic |
| Storable but Non-Cacheable Content | Informational | 1 |




## Alert Detail



### [ A Server Error response code was returned by the server ](https://www.zaproxy.org/docs/alerts/100000/)



##### Low (High)

### Description

A response code of 500 was returned by the server.
This may indicate that the application is failing to handle unexpected input correctly.
Raised by the 'Alert on HTTP Response Code Error' script

* URL: http://localhost:3000/api/users/4656420115663864681
  * Node Name: `http://localhost:3000/api/users/4656420115663864681`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `500`
  * Other Info: ``


Instances: 1

### Solution



### Reference



#### CWE Id: [ 388 ](https://cwe.mitre.org/data/definitions/388.html)


#### WASC Id: 20

#### Source ID: 4

### [ Server Leaks Information via "X-Powered-By" HTTP Response Header Field(s) ](https://www.zaproxy.org/docs/alerts/10037/)



##### Low (Medium)

### Description

The web/application server is leaking information via one or more "X-Powered-By" HTTP response headers. Access to such information may facilitate attackers identifying other frameworks/components your web application is reliant upon and the vulnerabilities such components may be subject to.

* URL: http://localhost:3000/api-docs/openapi.json
  * Node Name: `http://localhost:3000/api-docs/openapi.json`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `X-Powered-By: Express`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/me
  * Node Name: `http://localhost:3000/api/auth/me`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `X-Powered-By: Express`
  * Other Info: ``
* URL: http://localhost:3000/health
  * Node Name: `http://localhost:3000/health`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `X-Powered-By: Express`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login
  * Node Name: `http://localhost:3000/api/auth/login ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `X-Powered-By: Express`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register
  * Node Name: `http://localhost:3000/api/auth/register ()({nombre,email,password,tipo_donante,organizacion,telefono,ciudad})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `X-Powered-By: Express`
  * Other Info: ``

Instances: Systemic


### Solution

Ensure that your web server, application server, load balancer, etc. is configured to suppress "X-Powered-By" headers.

### Reference


* [ https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/08-Fingerprint_Web_Application_Framework ](https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/01-Information_Gathering/08-Fingerprint_Web_Application_Framework)
* [ https://www.troyhunt.com/shhh-dont-let-your-response-headers/ ](https://www.troyhunt.com/shhh-dont-let-your-response-headers/)


#### CWE Id: [ 497 ](https://cwe.mitre.org/data/definitions/497.html)


#### WASC Id: 13

#### Source ID: 3

### [ X-Content-Type-Options Header Missing ](https://www.zaproxy.org/docs/alerts/10021/)



##### Low (Medium)

### Description

The Anti-MIME-Sniffing header X-Content-Type-Options was not set to 'nosniff'. This allows older versions of Internet Explorer and Chrome to perform MIME-sniffing on the response body, potentially causing the response body to be interpreted and displayed as a content type other than the declared content type. Current (early 2014) and legacy versions of Firefox will use the declared content type (if one is set), rather than performing MIME-sniffing.

* URL: http://localhost:3000/api-docs/openapi.json
  * Node Name: `http://localhost:3000/api-docs/openapi.json`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://localhost:3000/api/auth/me
  * Node Name: `http://localhost:3000/api/auth/me`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://localhost:3000/api/users%3Flimit=20&offset=0
  * Node Name: `http://localhost:3000/api/users (limit,offset)`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://localhost:3000/api/users/1
  * Node Name: `http://localhost:3000/api/users/1`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`
* URL: http://localhost:3000/health
  * Node Name: `http://localhost:3000/health`
  * Method: `GET`
  * Parameter: `x-content-type-options`
  * Attack: ``
  * Evidence: ``
  * Other Info: `This issue still applies to error type pages (401, 403, 500, etc.) as those pages are often still affected by injection issues, in which case there is still concern for browsers sniffing pages away from their actual content type.
At "High" threshold this scan rule will not alert on client or server error responses.`


Instances: 5

### Solution

Ensure that the application/web server sets the Content-Type header appropriately, and that it sets the X-Content-Type-Options header to 'nosniff' for all web pages.
If possible, ensure that the end user uses a standards-compliant and modern web browser that does not perform MIME-sniffing at all, or that can be directed by the web application/web server to not perform MIME-sniffing.

### Reference


* [ https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85) ](https://learn.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/gg622941(v=vs.85))
* [ https://owasp.org/www-community/Security_Headers ](https://owasp.org/www-community/Security_Headers)


#### CWE Id: [ 693 ](https://cwe.mitre.org/data/definitions/693.html)


#### WASC Id: 15

#### Source ID: 3

### [ A Client Error response code was returned by the server ](https://www.zaproxy.org/docs/alerts/100000/)



##### Informational (High)

### Description

A response code of 400 was returned by the server.
This may indicate that the application is failing to handle unexpected input correctly.
Raised by the 'Alert on HTTP Response Code Error' script

* URL: http://localhost:3000
  * Node Name: `http://localhost:3000`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/
  * Node Name: `http://localhost:3000/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/2535688109873413048
  * Node Name: `http://localhost:3000/2535688109873413048`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api
  * Node Name: `http://localhost:3000/api`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api-docs
  * Node Name: `http://localhost:3000/api-docs`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api-docs/
  * Node Name: `http://localhost:3000/api-docs/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api-docs/3224212718432287981
  * Node Name: `http://localhost:3000/api-docs/3224212718432287981`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/
  * Node Name: `http://localhost:3000/api/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/3376002878393168822
  * Node Name: `http://localhost:3000/api/3376002878393168822`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/auth
  * Node Name: `http://localhost:3000/api/auth`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/
  * Node Name: `http://localhost:3000/api/auth/`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/2921420935508386882
  * Node Name: `http://localhost:3000/api/auth/2921420935508386882`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/actuator/health
  * Node Name: `http://localhost:3000/api/auth/actuator/health`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/users%3Flimit=http%253A%252F%252Fwww.google.com%252F&offset=0
  * Node Name: `http://localhost:3000/api/users (limit,offset)`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://localhost:3000/api/users/1/6143092186948202642
  * Node Name: `http://localhost:3000/api/users/1/6143092186948202642`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/api/users/1/estado
  * Node Name: `http://localhost:3000/api/users/1/estado ()({activo})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://localhost:3000/api/users/1/estado/
  * Node Name: `http://localhost:3000/api/users/1/estado/ ()({activo})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://localhost:3000/api/users/1/rol
  * Node Name: `http://localhost:3000/api/users/1/rol ()({rol})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://localhost:3000/api/users/1/rol/
  * Node Name: `http://localhost:3000/api/users/1/rol/ ()({rol})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login
  * Node Name: `http://localhost:3000/api/auth/login ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login
  * Node Name: `http://localhost:3000/api/auth/login ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login/
  * Node Name: `http://localhost:3000/api/auth/login/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `401`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register
  * Node Name: `http://localhost:3000/api/auth/register ()({nombre,email,password,tipo_donante,organizacion,telefono,ciudad})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register
  * Node Name: `http://localhost:3000/api/auth/register ()({nombre,email,password,tipo_donante,organizacion,telefono,ciudad})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `409`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register/
  * Node Name: `http://localhost:3000/api/auth/register/ ()({nombre,email,password,tipo_donante,organizacion,telefono,ciudad})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `400`
  * Other Info: ``
* URL: http://localhost:3000/computeMetadata/v1/
  * Node Name: `http://localhost:3000/computeMetadata/v1/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/latest/meta-data/
  * Node Name: `http://localhost:3000/latest/meta-data/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/metadata/instance
  * Node Name: `http://localhost:3000/metadata/instance ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/metadata/v1
  * Node Name: `http://localhost:3000/metadata/v1 ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/opc/v1/instance/
  * Node Name: `http://localhost:3000/opc/v1/instance/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/opc/v2/instance/
  * Node Name: `http://localhost:3000/opc/v2/instance/ ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``
* URL: http://localhost:3000/openstack/latest/meta_data.json
  * Node Name: `http://localhost:3000/openstack/latest/meta_data.json ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `404`
  * Other Info: ``


Instances: 32

### Solution



### Reference



#### CWE Id: [ 388 ](https://cwe.mitre.org/data/definitions/388.html)


#### WASC Id: 20

#### Source ID: 4

### [ Authentication Request Identified ](https://www.zaproxy.org/docs/alerts/10111/)



##### Informational (High)

### Description

The given request has been identified as an authentication request. The 'Other Info' field contains a set of key=value lines which identify any relevant fields. If the request is in a context which has an Authentication Method set to "Auto-Detect" then this rule will change the authentication to match the request identified.

* URL: http://localhost:3000/api/auth/login
  * Node Name: `http://localhost:3000/api/auth/login ()({email,password})`
  * Method: `POST`
  * Parameter: `email`
  * Attack: ``
  * Evidence: `password`
  * Other Info: `userParam=email
userValue=zaproxy@example.com
passwordParam=password`


Instances: 1

### Solution

This is an informational alert rather than a vulnerability and so there is nothing to fix.

### Reference


* [ https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/ ](https://www.zaproxy.org/docs/desktop/addons/authentication-helper/auth-req-id/)



#### Source ID: 3

### [ Non-Storable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are not storable by caching components such as proxy servers. If the response does not contain sensitive, personal or user-specific information, it may benefit from being stored and cached, to improve performance.

* URL: http://localhost:3000/api/auth/me
  * Node Name: `http://localhost:3000/api/auth/me`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: http://localhost:3000/health
  * Node Name: `http://localhost:3000/health`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: http://localhost:3000/api/users/1/rol
  * Node Name: `http://localhost:3000/api/users/1/rol ()({rol})`
  * Method: `PATCH`
  * Parameter: ``
  * Attack: ``
  * Evidence: `PATCH `
  * Other Info: ``
* URL: http://localhost:3000/api/auth/login
  * Node Name: `http://localhost:3000/api/auth/login ()({email,password})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``
* URL: http://localhost:3000/api/auth/register
  * Node Name: `http://localhost:3000/api/auth/register ()({nombre,email,password,tipo_donante,organizacion,telefono,ciudad})`
  * Method: `POST`
  * Parameter: ``
  * Attack: ``
  * Evidence: `authorization:`
  * Other Info: ``

Instances: Systemic


### Solution

The content may be marked as storable by ensuring that the following conditions are satisfied:
The request method must be understood by the cache and defined as being cacheable ("GET", "HEAD", and "POST" are currently defined as cacheable)
The response status code must be understood by the cache (one of the 1XX, 2XX, 3XX, 4XX, or 5XX response classes are generally understood)
The "no-store" cache directive must not appear in the request or response header fields
For caching by "shared" caches such as "proxy" caches, the "private" response directive must not appear in the response
For caching by "shared" caches such as "proxy" caches, the "Authorization" header field must not appear in the request, unless the response explicitly allows it (using one of the "must-revalidate", "public", or "s-maxage" Cache-Control response directives)
In addition to the conditions above, at least one of the following conditions must also be satisfied by the response:
It must contain an "Expires" header field
It must contain a "max-age" response directive
For "shared" caches such as "proxy" caches, it must contain a "s-maxage" response directive
It must contain a "Cache Control Extension" that allows it to be cached
It must have a status code that is defined as cacheable by default (200, 203, 204, 206, 300, 301, 404, 405, 410, 414, 501).

### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3

### [ Storable but Non-Cacheable Content ](https://www.zaproxy.org/docs/alerts/10049/)



##### Informational (Medium)

### Description

The response contents are storable by caching components such as proxy servers, but will not be retrieved directly from the cache, without validating the request upstream, in response to similar requests from other users.

* URL: http://localhost:3000/api-docs/openapi.json
  * Node Name: `http://localhost:3000/api-docs/openapi.json`
  * Method: `GET`
  * Parameter: ``
  * Attack: ``
  * Evidence: `max-age=0`
  * Other Info: ``


Instances: 1

### Solution



### Reference


* [ https://datatracker.ietf.org/doc/html/rfc7234 ](https://datatracker.ietf.org/doc/html/rfc7234)
* [ https://datatracker.ietf.org/doc/html/rfc7231 ](https://datatracker.ietf.org/doc/html/rfc7231)
* [ https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html ](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html)


#### CWE Id: [ 524 ](https://cwe.mitre.org/data/definitions/524.html)


#### WASC Id: 13

#### Source ID: 3


