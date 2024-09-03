# SEAL SECURITY PROJECT
The task is to fix issue with Prototype Pollution vulnerability (CVE-2023-26136) for NodeJs package tough-cookie (v2.5.0)
To reproduce the issue on tough-cookie v2.5.0 WITHOUT FIX
Run commands:
```    
npm install tough-cookie@2.5.0
node index.js
```
The output will contain `EXPLOITED SUCCESSFULLY`

To install version with fix and check the fix 
Run commands: 
```
npm install ./tough-cookie-patch-2.5.0.tgz
node index.js
```
The output will contain EXPLOIT FAILED
index.js is based on sample provided by Snyk

The fix of cookie-patch can be found in the file `changes.diff` .
It was created on repository [https://github.com/m-lito13/tough-cookie](https://github.com/m-lito13/tough-cookie)

## Prototype Pollution Vulnerability
Prototype pollution is a JavaScript vulnerability that enables an attacker to add arbitrary properties to global object prototypes, which may then be inherited by user-defined objects.
A prototype pollution source is any user-controllable input that enables you to add arbitrary properties to prototype objects. 
Prototype pollution vulnerabilities typically arise when a JavaScript function recursively merges an object containing user-controllable properties into an existing object, without first sanitizing the keys. 
As we know, if some property is not found in some JavaScript object, it searched in the it's prototype. There is special key `__proto__` used for changing objects prototype.

Here is some example : 
```
function myClass() { 
    this.prop1 = 'p1';
    this.prop2 = 'p2';
}

let item = new myClass();
console.log(item.prop1);
console.log(item.prop2);
console.log(item.prop3);//output - undefined, no such propety in the instance of class myClass

item.__proto__.prop3 = '33';
let item2 = new myClass();
console.log(item2.prop1);
console.log(item2.prop2);
console.log(item2.prop3);//output - 33
```

The most common sources are URL , JSON , Web messages. For tough-cookie package related source is URL. 
Here example for prototype pollution via URL: 

`https://vulnerable-website.com/?__proto__[badProperty]=payload`

When breaking the query string down into key:value pairs, a URL parser may interpret __proto__ as an arbitrary string. After some merge operations target object will get property with value 'payload' as following : 

`targetObject.__proto__.badProperty = 'payload';`

For tough-cookie package (version 2.5.0) following code snippet (based on sample provided by Snyk) illustrates how the vulnerability arrises by using CookieJar object : 

```
await new Promise((resolve, reject) => {
            cookiejar.setCookie(
                "Slonser=polluted; Domain=__proto__; Path=/notauth",
                "https://__proto__/admin",
                { loose: true },
                (err, cookie) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(cookie);
                    }
                }
            );
        });
```
It was found that by deafult(for version 2.5.0) CookieJar uses MemoryCookieStore as store. In MemoryCookieStore in several places objects initialized like this 
`this.idx = {};`  Inb order to prevent usage(and modifying) of `__proto__` object are initilized as following `Object.create(null)`; In this case initially created object without prototype



