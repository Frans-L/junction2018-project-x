import bottle
bottle.BaseRequest.MEMFILE_MAX = 1024 * 1024

from bottle import route, request, run, hook, response

import cv2
import numpy as np
from time import time
import json

@hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

model = cv2.CascadeClassifier('cars.xml')

points = [
    {
        'lat': 60.22,
        'lng': 22.43,
        'timestamp': time(),
        'has_car': True,
    },
    {
        'lat': 60.23,
        'lng': 22.44,
        'timestamp': time(),
        'has_car': True,
    },
    {
        'lat': 60.25,
        'lng': 22.43,
        'timestamp': time(),
        'has_car': True,
    },
    {
        'lat': 60.25,
        'lng': 22.43,
        'timestamp': time(),
        'has_car': False,
    },
]

@route('/img', method=['POST'])
def img():
    global points

    file = next(request.files.values()).file
    data = np.asarray(bytearray(file.read()), np.uint8)
    orig = cv2.imdecode(data, cv2.CV_8U)

    cars = model.detectMultiScale(orig, 1.1, 1)

    for (x,y,w,h) in cars:
        cv2.rectangle(orig, (x,y), (x+w,y+h), (0,0,255), 2)

    cv2.imshow('win', orig)
    cv2.waitKey(0)
    # data = {
    #   **request.json,
    #   'timestamp': time(),
    #   'has_car': has_car,
    # }

    # points.append(data)

    # return json.dumps(data)

    # plt.subplot(211)
    # plt.imshow(orig)
    # plt.subplot(212)
    # plt.imshow(img[0,0,:,:,0])

    # plt.show()

@route('/points', method=['GET'])
def point():
    return json.dumps(points)


if __name__ == '__main__':
    try:
        run(host='0.0.0.0', port=8000, server='auto')
    finally:
        print('detaching...')
