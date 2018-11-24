import bottle
bottle.BaseRequest.MEMFILE_MAX = 1024 * 1024

from bottle import route, request, run
import tensorflow as tf

import cv2
import numpy as np
from time import time
import json
from matplotlib import pyplot as plt

sess = tf.Session()

saver = tf.train.import_meta_graph('car-detector.tf-1000.meta')
saver.restore(sess,tf.train.latest_checkpoint('./'))
graph = tf.get_default_graph()

tf_data = graph.get_tensor_by_name("image_input:0")
tf_train = graph.get_tensor_by_name("train_input:0")
tf_label = graph.get_tensor_by_name("labels_input:0")
sm = graph.get_tensor_by_name("output:0")

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
    orig = cv2.cvtColor(cv2.imdecode(data, cv2.CV_32S), cv2.COLOR_BGR2RGB)

    w, h, _ = orig.shape
    img = orig[int(w/3):int(-w/3), int(h/3):int(-h/3)]

    img = sess.run([sm], feed_dict={tf_data: img.reshape([1, *img.shape]), tf_train: False})

    img = np.array(img)

    has_car = np.average(img) > 0.5

    print(np.max(img), np.min(img), np.average(img))

    data = {
      **request.json,
      'timestamp': time(),
      'has_car': has_car,
    }

    points.append(data)

    return json.dumps(data)

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
        run(host='0.0.0.0', port=9999, server='auto')
    finally:
        print('detaching...')
        sess.close()
