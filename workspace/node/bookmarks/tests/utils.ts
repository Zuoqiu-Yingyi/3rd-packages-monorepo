export function deserializeObject(obj: any) {
    if (Array.isArray(obj)) {
        obj.forEach((value) => {
            deserializeObject(value);
        });
    }
    else if (typeof obj === "object") {
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                switch (key) {
                    case "added":
                    case "visited":
                    case "modified":
                        obj[key] = new Date(value);
                        break;
                    default:
                        break;
                }
                deserializeObject(value);
            }
        }
    }
}
