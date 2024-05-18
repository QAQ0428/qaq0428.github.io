/**
 * 
 * @param {number} a 
 * @param {number} b 
 * @returns [a, b]上的随机整数
 */
export function randint(a, b) {
    return Math.floor((b - a + 1) * Math.random() + a)
}