#!/bin/sh
until(/usr/bin/mc config host add s3 "${AWS_ENDPOINT_URL}" "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}")
    do sleep 0.1
done;
/usr/bin/mc admin accesskey create s3 --access-key "${AWS_ACCESS_KEY_ID}" --secret-key "${AWS_SECRET_ACCESS_KEY}"
/usr/bin/mc mb -p s3/"${S3_BUCKET}"
/usr/bin/mc mirror /tmp/testdata s3/"${S3_BUCKET}"
exit 0