#!/bin/zsh

# Open iTerm and create a new window
osascript <<EOF
tell application "iTerm"
    create window with default profile
    tell current session of first window
        write text "cd vue-planner/server && python3 server.py"
    end tell
    tell first window
        create tab with default profile
        tell current session
            write text "cd vue-planner/server && npm start"
        end tell
        create tab with default profile
        tell current session
            write text "cd vue-planner && npm run serve"
        end tell
    end tell
end tell
EOF

echo "All servers started!"
