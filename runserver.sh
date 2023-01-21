
if [[ -z $PUBLIC_URL ]]; then
  echo "export PUBLIC_URL to continue"
  exit 1
fi

cd theodo/ && npm run build
cd ../server && cargo run
