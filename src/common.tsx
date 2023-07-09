export function capitalizeFirstLetter(str: string | undefined) {
    return str ? str.charAt(0).toUpperCase() + str.substring(1).toLowerCase() : ""
}