sleep ${RANDOM:0:2}m
locust --host="http://${FRONTEND_ADDR}" --headless -u "${USERS}" -r 100 --runt-time 3m 2>&1