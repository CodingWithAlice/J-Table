tell application "iTerm"
    activate
    
    -- ???????????
    tell current window
        set newTab to (create tab with default profile)
        
        tell current session of newTab
            -- ??????
            set webSession to (split vertically with default profile)
            
            -- ??????? web ??
            tell webSession
                set name to "WEB"
                write text "npm run web"
            end tell
            
            -- ??????? server ??
            set name to "SERVER"
            write text "npm run server"
        end tell
    end tell
end tell