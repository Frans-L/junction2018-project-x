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

from google.cloud import vision
client = vision.ImageAnnotatorClient()

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

points.sort(key=lambda p: p['timestamp'])

# plt.ion()

# model = cv2.CascadeClassifier('cars.xml')

@route('/img', method=['POST'])
def img():
    global points

    # print(request.forms['loc'])

    content = next(request.files.values()).file.read()
    data = np.asarray(bytearray(content), np.uint8)
    orig = cv2.imdecode(data, cv2.CV_32S)

    # gray = cv2.cvtColor(orig, cv2.COLOR_RGB2GRAY)

    w, h, _ = orig.shape
    # img = orig[int(w/3):int(-w/3), int(h/3):int(-h/3)]

    # img = sess.run([sm], feed_dict={tf_data: img.reshape([1, *img.shape]), tf_train: False})

    # cars = model.detectMultiScale(gray, 1.1, 1)

    # img = np.array(img)

    image = vision.types.Image(content=content)

    objects = client.object_localization(
        image=image).localized_object_annotations

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

    for obj in objects:
        if obj.name != 'Car':
            continue
        pts = np.array([[w*v.x, h*v.y] for v in obj.bounding_poly.normalized_vertices], dtype=np.int32)
        print(pts)
        data['cars'].append({
            'confidence': obj.score,
        })
        cv2.polylines(orig, [pts], True, (0, 0, 255), 2)

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
        run(host='0.0.0.0', port=9999, server='auto')
    finally:
        print('detaching...')
