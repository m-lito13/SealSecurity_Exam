# SealSecurity_Exam
Prototype pollution is a JavaScript vulnerability that enables an attacker to 
add arbitrary properties to global object prototypes, which may then be inherited by user-defined objects.
A prototype pollution source is any user-controllable input that enables you to add arbitrary properties to prototype objects. 
The most common sources are as follows:
URL 
JSON
Web Messages

For tough-cookies package ( v2.5.0) more relevant first one via URL
It happens as following: 

Here some request: 

`https://vulnerable-website.com/?__proto__[badProperty]=payload`
When breaking the query string down into key:value pairs, a URL parser may interpret __proto__ as an arbitrary string. 
At some point, the recursive merge operation may assign the value of evilProperty using a statement equivalent to the following:

`targetObject.__proto__.badProperty = 'payload';`

`__proto__` has special usage in JavaScript. As we know , if for some object some property P1 was not found, it will be searched in the prototype of this object

Example
```
function myClass() { 
  this.P1 = 'value';
} 
let mc = new myClass();
console.log(mc.P1); //Value 
console.log(mc.P2); //Undefined
mc.__proto__.P2 = 'value2';
let mc2 = new myClass();
console.log(mc.P2); //value2
```
After changing `__proto__` - all created instances of myClass will have property P2

For tough-cookies package ( v2.5.0 ) this prototype pollution vulnerability can be seen from code snippet :  


