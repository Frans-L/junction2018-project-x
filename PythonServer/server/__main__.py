import os
import bottle
bottle.BaseRequest.MEMFILE_MAX = 1024 * 1024

from bottle import route, request, run, hook, response

import cv2
import numpy as np
from time import time
import json
from matplotlib import pyplot as plt
import shutil

@hook('after_request')
def enable_cors():
    """
    You need to add some headers to each request.
    Don't use the wildcard '*' for Access-Control-Allow-Origin in production.
    """
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

# sess = tf.Session()

# saver = tf.train.import_meta_graph('car-detector.tf-1000.meta')
# saver.restore(sess,tf.train.latest_checkpoint('./'))
# graph = tf.get_default_graph()

# tf_data = graph.get_tensor_by_name("image_input:0")
# tf_train = graph.get_tensor_by_name("train_input:0")
# tf_label = graph.get_tensor_by_name("labels_input:0")
# sm = graph.get_tensor_by_name("output:0")

# points = [
#     {
#         'latitude': 60.185248,
#         'longitude': 24.831129,
#         'timestamp': time(),
#         'has_car': True,
#     },
#     {
#         'latitude': 60.185734,
#         'longitude': 24.831416,
#         'timestamp': time(),
#         'has_car': True,
#     },
#     {
#         'latitude': 60.186177,
#         'longitude': 24.832627,
#         'timestamp': time(),
#         'has_car': True,
#     },
#     {
#         'latitude': 60.186715,
#         'longitude': 24.833461,
#         'timestamp': time(),
#         'has_car': False,
#     },
# ]

points = []
files = os.listdir('server/data')
files = [f for f in files if f.endswith('.json')]
for fn in files:
    with open(f'server/data/{fn}', 'r') as f:
        points.append(json.load(f))

plt.ion()

model = cv2.CascadeClassifier('cars.xml')

@route('/img', method=['POST'])
def img():
    global points

    print(request.forms['loc'])

    file = next(request.files.values()).file
    data = np.asarray(bytearray(file.read()), np.uint8)
    orig = cv2.imdecode(data, cv2.CV_32S)

    gray = cv2.cvtColor(orig, cv2.COLOR_RGB2GRAY)

    # w, h, _ = orig.shape
    # img = orig[int(w/3):int(-w/3), int(h/3):int(-h/3)]

    # img = sess.run([sm], feed_dict={tf_data: img.reshape([1, *img.shape]), tf_train: False})

    cars = model.detectMultiScale(gray, 1.1, 1)

    # img = np.array(img)

    # plt.imshow(img[0, 0, :, :, 0])
    # plt.pause(0.01)

    # has_car = np.average(img[0, 0, :, :, 0]) > 0.5

    # print(np.max(img), np.min(img), np.average(img))

    fn = f'server/data/{time()}'

    cv2.imwrite(f'{fn}-orig.png', orig)

    data = {
        **json.loads(request.forms['loc']),
        'timestamp': time(),
        'has_car': 1, # TODO
        'cars': [],
    }

    for (x, y, w, h) in cars:
        data['cars'].append({
            'x': int(x),
            'y': int(y),
            'w': int(w),
            'h': int(h),
        })
        cv2.rectangle(orig, (x, y), (x+w, y+h), (0, 0, 255), 2)

    points.append(data)

    with open(f'{fn}.json', 'w') as f:
        f.write(json.dumps(data))

    cv2.imwrite(f'{fn}-cars.png', orig)

    return json.dumps(data)

    # plt.subplot(211)
    # plt.imshow(orig)
    # plt.subplot(212)
    # plt.imshow(img[0,0,:,:,0])

    # plt.show()

@route('/points', method=['GET'])
def point():
    return json.dumps(points)


@route('/clear', method=['DELETE'])
def clear():
    global points
    points = []
    shutil.copytree('server/data', f'server/data.{time()}.bak')
    shutil.rmtree('server/data')
    os.mkdir('server/data')

if __name__ == '__main__':
    try:
        run(host='0.0.0.0', port=8000, server='auto')
    finally:
        print('detaching...')
