if [ $# -ne 2 ]; then
	echo "Usage: $0 <uuid> <otp>"
	exit 1
fi

if [ ${#2} -lt 6 ]; then
	echo "OTP must be 6 digits long"
	exit 1
fi

echo "{\"code\":\"$2\"}" > "scraper/temp/otp-$filename.json"