task :install do
  puts "Installing bundle ..."
  system "bundle install > /dev/null"
  puts "Installing bourbon ..."
  system "bourbon install --path source/stylesheets/vendor"
  fetch_dependencies
end

task :update do
  puts "Updating bundle ..."
  system "bundle install > /dev/null"
  puts "Updating bourbon ..."
  system "bourbon update --path source/stylesheets/vendor > /dev/null"
  fetch_dependencies
end

def fetch_dependencies
  puts "Fetching jQuery ..."
  system "curl -o build/javascripts/jquery.min.js http://code.jquery.com/jquery-latest.min.js"
  puts "Fetching normalize.css"
  system "curl -o source/stylesheets/vendor/_normalize.scss http://necolas.github.io/normalize.css/2.1.2/normalize.css"
end