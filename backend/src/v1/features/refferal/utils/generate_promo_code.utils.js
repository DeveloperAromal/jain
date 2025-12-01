

function generatePromoCode(len = 6) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let refferal_code = ""

    for (let i = 0; i < len; i++) {
        refferal_code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    console.log(refferal_code)
    return refferal_code
}
