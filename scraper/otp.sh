if [ $# -ne 2 ]; then
		echo "Usage: $0 <filename> <otp>"
		exit 1
fi

if [[ ! $1 =~ .*@.* ]]; then
		echo "Usage: $0 <filename> <otp>"
		exit 1
fi

if [ ${#2} -lt 6 ]; then
		echo "OTP must be 6 digits long"
		exit 1
fi

filename=$(echo $1 | awk -F@ '{print $1}') 
echo $2 > "scraper/otp/$filename.json"