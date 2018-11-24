export function distanceFromLine(x, y, x1, y1, x2, y2) {
    let A = x - x1
    let B = y - y1
    let C = x2 - x1
    let D = y2 - y1

    let dot = A * C + B * D
    let len_sq = C * C + D * D
    let param = -1
    if (len_sq !== 0)
        param = dot / len_sq

    let xx, yy

    if (param < 0) {
        xx = x1
        yy = y1
    }
    else if (param > 1) {
        xx = x2
        yy = y2
    }
    else {
        xx = x1 + param * C
        yy = y1 + param * D
    }

    let dx = x - xx
    let dy = y - yy
    return Math.sqrt(dx * dx + dy * dy)
}

export function distanceFromParkingSpace(cameraPoint, parkingSpace) {
    return distanceFromLine(
        cameraPoint.lat,
        cameraPoint.lng,
        parkingSpace[0].lat,
        parkingSpace[0].lng,
        parkingSpace[1].lat,
        parkingSpace[1].lng
    )
}